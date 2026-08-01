import kleur from 'kleur'
import readline from 'readline/promises'
import type { NameDescriptionValue } from './interfaces'

function printBlankLine() {
    console.log()
}

export default {

    logWelcome: function () {
        console.log('Welcome to your local AI chat')
        console.log(`${kleur.grey('Enter your prompts or type')} ${kleur.reset('/help')} ${kleur.grey('for available commands')}`)
        printBlankLine()
    },

    logCommands: function () {
        console.log(kleur.cyan('Commands:'))
        console.log(`  ${kleur.grey('Type')} ${kleur.white('/help')} ${kleur.grey('to see this help.')}`)
        console.log(`  ${kleur.grey('Type')} ${kleur.white('/models')} ${kleur.grey('to list available models.')}`)
        console.log(`  ${kleur.grey('Type')} ${kleur.white('/tools')} ${kleur.grey('to list server tools.')}`)
        console.log(`  ${kleur.grey('Type')} ${kleur.white('/prompts')} ${kleur.grey('to list server prompts.')}`)
        console.log(`  ${kleur.grey('Type')} ${kleur.white('/quit')} ${kleur.grey('or')} ${kleur.white('/exit')} ${kleur.grey('to exit.')}`)
        printBlankLine()
    },

    logOllamaModels: function (version: string, models: string[], selectedModel: string) {
        console.log(kleur.cyan('Ollama:'))
        console.log(kleur.grey(`  version ${version}`))
        console.log(kleur.cyan('Available models:'));
        [...models].sort().forEach((model) => {
            console.log(`[${model === selectedModel ? 'X' : ' '}] ${kleur.grey(model)}`)
        })
        printBlankLine()
    },

    logTools: function (tools: NameDescriptionValue[]) {
        if (tools.length === 0) {
            console.log(kleur.yellow('No tools available.'))
            return
        }

        console.log(kleur.cyan('Available tools:'))
        tools.forEach((tool) =>
            console.log(`  ${kleur.white(tool.name)}${kleur.grey(`: ${tool.description}`)}`)
        )
        printBlankLine()
    },

    logPrompts: function (prompts: NameDescriptionValue[]) {
        if (prompts.length === 0) {
            console.log(kleur.yellow('No prompts available.'))
            return
        }

        console.log(kleur.cyan('Available prompts:'))
        prompts.forEach((prompt) =>
            console.log(`  ${kleur.white(prompt.name)}${kleur.grey(`: ${prompt.description}`)}`)
        )
        printBlankLine()
    },

    logAssistantMessage: function (rl: readline.Interface, message: string) {
        rl.write(message)
    },

    logToolCall: function (rl: readline.Interface, tool: string) {
        rl.write(kleur.grey(`Calling tool '${tool}'`))
    },

    logServerPrompt: function (rl: readline.Interface, prompt: string) {
        rl.write(`${kleur.grey(prompt)}\n`)
    },

    logUnknownCommand: function (rl: readline.Interface, command: string) {
        rl.write(`Unknown command "${command}"`)
    },

    logNewLine: function (rl: readline.Interface) {
        rl.write('\n')
    },

}