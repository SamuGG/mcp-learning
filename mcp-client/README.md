# MCP Client

## Terminal 1 - MLX LM server

- Create an empty Python environment: `mkdir mlx && cd $_ && python3 -m venv myenv`
- Enter Python environment: `source myenv/bin/activate`
- First-time MLX LM install: `pip install mlx-lm`
- First-time MLX_LM HTTP server start (downloads model): `mlx_lm.server --model mlx-community/Qwen3.5-4B-8bit`
- Subsequent MLX_LM HTTP server start: `mlx_lm.server`

---

- Stop the server with Ctl+C
- Exit the Python environment: `deactivate`

### MLX Models

- Hugging Face [MLX community](https://huggingface.co/mlx-community)
- Remove model: `rm -rf ~/cache/huiggingface/hub/models--mlx-community--Qwen3.5-4B-8bit`

### MLX_LM Testing

- Test the server sending a prompt: `mlx_lm.generate --prompt "Hello"`
- Test starting a chat: `mlx_lm.chat --model mlx-community/Qwen3.5-4B-8bit`
- Test sending HTTP request: `curl -X POST http://127.0.0.1.8080/v1/chat/completions -H "Content-Type: application/json" -d '{ "model": "default_model", "messages": [ { "role": "user", "content": "Hello" }] }'`

## Terminal 2 - MCP client

- Change current directory: `cd mcp-client`
- First-time dependencies install: `bun install`
- Build sources: `bun run build`
- Run the project: `bun run --bun build/index.js "${PWD%/*}/mcp-server/build/index.js"`
- When the chat starts, send prompts or type `/help` for invoking implemented commands
