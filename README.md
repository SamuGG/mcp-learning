# MCP Learning

This is a sample project to learn about MCP servers and MCP clients while running everything locally on your computer.

## Architecture

The [MCP server](./mcp-server/README.md) exposes capabilities about a fictitious **Star Wars** movie repository.

It's implemented in Typescript; uses an in-memory database of movies (just a simple array), implements a couple of tools (`get-movies` and `filter-movies`) and a couple of prompts (`find-movies-by-character` and `sort-movies-by-rating`) acting as templates for common tasks.

The [MCP client](./mcp-client/README.md) is a Typescript console application using [MLX](https://opensource.apple.com/projects/mlx/) for chatting with the LLM model of your choice.

## How It Works

Every user message in the chat is sent with the list of tools available from the MCP server; in case the model decides to call them.

Calling tools is a manual process that must be implemented by observing the response object when `chatCompletion.choices[i].delta.tool_calls.length > 0`.

For this, create an instance of `@modelcontextprotocol/sdk/client` and connect this MCP client to the MCP server with `mcpClient.connect(transport)`, where `transport` is an instance of `StdioClientTransport` (since everything is running locally).

Then, call the tool with `mcpClient.callTool()` and finally, send the tool's result back to the LLM in another message for getting the final reply.

## Requirements

- [MLX LM](https://github.com/ml-explore/mlx-lm) (includes MLX)
- [Bun](https://bun.sh)

## How To Run

1. Install MLX LM
2. Start server pulling a light-weight model with `tools` support; e.g. `mlx-community/Qwen3.5-4B-8bit`
3. Build the MCP server
4. Build and run the MCP client
5. Chat: `Rate Star Wars episodes featuring Luke Skywalker.`
    - Invoke commands: `/help`, `/models`, `/tools`, `/prompts`
    - Invoke server prompts: `/prompt__find-movies-by-character Darth Vader`

## References

- [Server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [Client concepts](https://modelcontextprotocol.io/docs/learn/client-concepts)
- [Function calling](https://developers.openai.com/api/docs/guides/function-calling)
- [Streaming responses](https://developers.openai.com/api/docs/guides/streaming-responses)
