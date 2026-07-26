import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import type { Prompt } from '@modelcontextprotocol/sdk/types'
import OpenAI from 'openai'
import type { ChatCompletionFunctionTool } from 'openai/resources/chat/completions'
import type { CompleterResult } from 'readline'
import readline from 'readline/promises'
import logger from './chat-logger'
import type { NameVersionValue } from './interfaces'
import type { Settings } from './main-configuration'

export class AIChat {
    private readonly settings: Settings
    private readonly chatClient: OpenAI
    private readonly clientInfo: NameVersionValue = { name: 'starwars-cli', version: '1.0.0' }
    private mcpClient: Client | null = null
    private transport: StdioClientTransport | null = null
    private serverTools: ChatCompletionFunctionTool[] = []
    private serverPrompts: Prompt[] = []
    private messages: OpenAI.Chat.ChatCompletionMessageParam[] = []

    constructor(settings: Settings) {
        this.settings = settings
        this.chatClient = new OpenAI({ baseURL: settings.mlxEndpoint, apiKey: 'dummy' })
        logger.logWelcome()
    }

    async initializeMCP() {
        this.mcpClient = new Client(this.clientInfo)

        this.transport = new StdioClientTransport({
            command: 'bun',
            args: [this.settings.serverScriptPath]
        })

        try {
            await this.mcpClient.connect(this.transport)
        } catch (e) {
            console.error('Failed to connect to MCP server: ', e)
            throw e
        }

        try {
            this.serverTools = await this.getServerTools(this.mcpClient)
        } catch (e) {
            console.error('Failed to get server tools: ', e)
            throw e
        }

        try {
            this.serverPrompts = await this.getServerPrompts(this.mcpClient)
        } catch (e) {
            console.error('Failed to get server prompts: ', e)
            throw e
        }
    }

    private async getServerTools(client: Client): Promise<ChatCompletionFunctionTool[]> {
        const toolsResult = await client.listTools()

        return toolsResult.tools.map((tool) => ({
            type: 'function' as const,
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema,
            }
        }))
    }

    private async getServerPrompts(client: Client) {
        const promptsResult = await client.listPrompts()

        return promptsResult.prompts.map((prompt) => ({
            name: prompt.name,
            title: prompt.title,
            description: prompt.description,
            arguments: prompt.arguments
        }))
    }

    async chatLoop() {
        // completions appear when user starts typing and presses TAB
        const completions = '/help /models /tools /prompts /quit /exit'
            .split(' ')
            .concat(this.serverPrompts.map((prompt) => `/prompt__${prompt.name}`))

        const completer = (line: string): CompleterResult => {
            const hits = completions.filter((c) => c.startsWith(line))
            return [hits.length ? hits : completions, line]
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            completer: completer,
        })

        try {
            chatloop: while (true) {
                const prompt = (await rl.question('Query: ')).trim()

                if (!prompt.length)
                    continue

                if (prompt[0] !== '/') {
                    await this.processMessage({
                        role: 'user',
                        content: prompt
                    }, rl)
                    continue
                }

                if (prompt.startsWith('/prompt__')) {
                    const userMessage = await this.generatePrompt(prompt, rl)
                    if (userMessage === undefined)
                        continue
                    await this.processMessage(userMessage, rl)
                    continue
                }

                switch (prompt.toLowerCase()) {
                    case completions[0]:
                        logger.logCommands()
                        break
                    case completions[1]:
                        await this.logMLXModels()
                        break
                    case completions[2]:
                        this.logServerTools()
                        break
                    case completions[3]:
                        this.logServerPrompts()
                        break
                    case completions[4]:
                    case completions[5]:
                        break chatloop
                    default:
                        logger.logUnknownCommand(rl, prompt)
                }
            }
        } finally {
            rl.close()
        }
    }

    private async processMessage(userMessage: OpenAI.Chat.ChatCompletionUserMessageParam, rl: readline.Interface) {
        this.messages.push(userMessage)

        while (true) {
            rl.pause()

            const stream = await this.chatClient.chat.completions.create({
                model: this.settings.mlxModel,
                messages: this.messages,
                stream: true,
                tools: this.serverTools.length > 0 ? this.serverTools : undefined,
            })

            // Build the response content and tool calls chunk by chunk below
            let assistantContent = ''
            const toolCalls: { id: string; type: string; function: { name: string; arguments: string } }[] = []

            // Stream output
            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta
                rl.pause()

                if (delta?.content) {
                    logger.logAssistantMessage(rl, delta.content)
                    assistantContent += delta.content
                }

                // Some chunks may include tool calls
                if (delta?.tool_calls) {
                    for (const tc of delta.tool_calls) {
                        const index = tc.index
                        if (!toolCalls[index as number]) {
                            toolCalls[index as number] = { id: '', type: 'function', function: { name: '', arguments: '' } }
                        }
                        const entry = toolCalls[index as number]!
                        if (tc.id) entry.id = tc.id
                        if (tc.function?.name) entry.function.name += tc.function.name
                        if (tc.function?.arguments) entry.function.arguments += tc.function.arguments
                    }
                }
            }

            logger.logNewLine(rl)
            this.messages.push({
                role: 'assistant',
                content: assistantContent,
                tool_calls: toolCalls.length > 0
                    ? toolCalls.map((call) => ({
                        id: call.id,
                        type: 'function' as const,
                        function: { name: call.function.name, arguments: call.function.arguments },
                    }))
                    : undefined,
            })

            // Finished normally
            if (!toolCalls.length) {
                break
            }

            // Execute requested tools
            for (const call of toolCalls) {
                logger.logToolCall(rl, call.function.name)

                const result = await this.mcpClient!.callTool({
                    name: call.function.name,
                    arguments: JSON.parse(call.function.arguments),
                })

                this.messages.push({
                    role: 'tool',
                    tool_call_id: call.id,
                    content: JSON.stringify(result),
                })
            }

            logger.logNewLine(rl)

            // Loop continues and sends updated conversation back to model
        }

        rl.resume()
    }

    private async generatePrompt(promptLine: string, rl: readline.Interface) {
        rl.pause()

        const lineSegments = promptLine.split(' ')
        const promptName = lineSegments[0]?.substring('/prompt__'.length)
        const serverPrompt = this.serverPrompts.find((prompt) => prompt.name === promptName)

        if (!serverPrompt) {
            logger.logServerPrompt(rl, 'Invalid prompt.')
            return
        }

        if (!serverPrompt.arguments || !serverPrompt.arguments.length)
            return this.getServerPromptAsUserMessage(serverPrompt.name, undefined, rl)

        // match each prompt argument name with each value provided in the prompt line
        const argsKeys = serverPrompt.arguments
        const argsValues = lineSegments.slice(1)
        const promptArgs: Record<string, string | undefined> = {}

        for (let i = 0; i < argsKeys.length; i++) {
            const key = argsKeys[i]!.name

            if (i === argsKeys.length - 1) {
                const remaining = argsValues.slice(i)
                promptArgs[key] = remaining.length ? remaining.join(' ') : undefined
            } else {
                promptArgs[key] = argsValues[i]
            }
        }

        if (promptArgs && Object.values(promptArgs).includes(undefined)) {
            logger.logServerPrompt(rl, `Please provide values for all prompt arguments: ${serverPrompt.arguments?.map((a) => a.name)?.join(', ')}`)
            return
        }

        const definedPromptArgs = promptArgs as Record<string, string>
        return this.getServerPromptAsUserMessage(serverPrompt.name, definedPromptArgs, rl)
    }

    private async getServerPromptAsUserMessage(name: string, promptArgs: Record<string, string> | undefined, rl: readline.Interface): Promise<OpenAI.Chat.ChatCompletionUserMessageParam | undefined> {
        const getPromptResult = await this.mcpClient!.getPrompt({ name: name, arguments: promptArgs })
        const firstTextMessage = getPromptResult.messages.find((m) => m.content.type === 'text') as { role: string, content: { text: string } } | undefined

        if (!firstTextMessage)
            return undefined

        logger.logServerPrompt(rl, firstTextMessage.content.text)

        return {
            role: 'user',
            content: firstTextMessage.content.text
        }
    }

    private async logMLXModels() {
        const models = await this.chatClient.models.list()
        const availableModels = models.data.map((model) => model.id)
        logger.logMLXModels(availableModels, this.settings.mlxModel)
    }

    private logServerTools() {
        const toolsSummary = this.serverTools.map((tool) => ({ name: tool.function.name!, description: tool.function.description }))
        logger.logTools(toolsSummary)
    }

    private logServerPrompts() {
        const promptsSummary = this.serverPrompts.map((prompt) => ({ name: prompt.name, description: prompt.description }))
        logger.logPrompts(promptsSummary)
    }

    async cleanup() {
        await this.mcpClient?.close()
    }

}