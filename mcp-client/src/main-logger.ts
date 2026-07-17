import kleur from 'kleur'

export default {

    logUsage: function () {
        console.log(kleur.cyan('Usage:'))
        console.log('  mcp-client [--host <ollama-host>] [--model <model-name>] mcp-server-script-path')
        console.log(kleur.grey('Options:'))
        console.log(kleur.grey('  --host <ollama-host> Ollama host (default: http://localhost:11434)'))
        console.log(kleur.grey('  --model <model-name> Model name (default: qwen3.5:4b)'))
        console.log(kleur.grey('Arguments:'))
        console.log(kleur.grey('  mcp-server-script-path Absolute path to the MCP server script to run'))
        console.log(kleur.grey('Examples:'))
        console.log(kleur.grey('  mcp-client /Users/<username>/workspaces/mcp-tutorial/mcp-server/build/index.js'))
        console.log(kleur.grey('  mcp-client --model llama3.2 "$(dirname "$(pwd)")/mcp-server/build/index.js"'))
        console.log(kleur.grey('  mcp-client --host http://localhost:11434 --model qwen3.5:4b "${PWD%/*}/mcp-server/build/index.js"'))
        console.log()
    },

}