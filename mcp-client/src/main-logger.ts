import kleur from 'kleur'

export default {

    logUsage: function () {
        console.log(kleur.cyan('Usage:'))
        console.log('  mcp-client [--endpoint <url>] [--model <model>] mcp-server-script-path')
        console.log(kleur.grey('Options:'))
        console.log(kleur.grey('  --endpoint <url>  MLX endpoint (default: http://localhost:8080/v1)'))
        console.log(kleur.grey('  --model <model>  Model name (default: mlx-community/Qwen3.5-4B-8bit)'))
        console.log(kleur.grey('Arguments:'))
        console.log(kleur.grey('  mcp-server-script-path Absolute path to the MCP server script to run'))
        console.log(kleur.grey('Examples:'))
        console.log(kleur.grey('  mcp-client /Users/<username>/workspaces/mcp-tutorial/mcp-server/build/index.js'))
        console.log(kleur.grey('  mcp-client --model mlx-community/Qwen3.5-4B-8bit "$(dirname "$(pwd)")/mcp-server/build/index.js"'))
        console.log(kleur.grey('  mcp-client --endpoint http://127.0.0.1:8080/v1 --model mlx-community/Qwen3.5:4B-8bit "${PWD%/*}/mcp-server/build/index.js"'))
        console.log()
    },

}