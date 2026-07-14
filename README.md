# MCP Learning

This is a sample project to learn about MCP servers and MCP clients while running everything locally on your computer.

## Architecture

The [MCP server](./mcp-server/README.md) exposes capabilities about a fictitious **Star Wars** movie repository.

It's implemented in Typescript; uses an in-memory database of movies (just a simple array), implements a couple of tools (`get-movies` and `filter-movies`) and a couple of prompts (`find-movies-by-character` and `sort-movies-by-rating`) acting as templates for common tasks.

## Requirements

- [Ollama](https://ollama.com)
- [Bun](https://bun.sh)

## How To Run

1. Install Ollama
2. Pull a light-weight model with `tools` support; e.g. [qwen3.5:4b](https://ollama.com/library/qwen3.5)
3. Build and run the MCP server

## References

- [Server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
