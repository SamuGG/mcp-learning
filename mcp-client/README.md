# MCP Client

## Terminal 1 - Ollama server

- Start Ollama app
- First-time model download: `ollama pull qwen3.5:4b`
- Stop Ollama by closing the app

### Models

- [Ollama models](https://ollama.com/search)
- Remove model: `ollama rm qwen3.5:4b`

### Testing

- Test starting a chat: `ollama run llama3.2`
- Test sending HTTP request: `curl -X POST http://127.0.0.1.11434/api/chat -H "Content-Type: application/json" -d '{ "model": "llama3.2", "messages": [ { "role": "user", "content": "Hello" }] }'`

## Terminal 2 - MCP client

- Change current directory: `cd mcp-client`
- First-time dependencies install: `bun install`
- Build sources: `bun run build`
- Run the project: `bun run --bun build/index.js "${PWD%/*}/mcp-server/build/index.js"`
- When the chat starts, send prompts or type `/help` for invoking implemented commands
