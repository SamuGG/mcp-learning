import { parseArgs } from 'util'
import logger from './main-logger'

export interface Settings {
    ollamaHost: string
    ollamaModel: string
    serverScriptPath: string
}

export default {
    parseArgs: function (): Settings {
        const { values, positionals } = parseArgs({
            args: Bun.argv.slice(2),
            options: {
                help: {
                    type: 'boolean',
                    default: false
                },
                host: {
                    type: 'string',
                    short: 'h',
                    default: 'http://localhost:11434',
                },
                model: {
                    type: 'string',
                    short: 'm',
                    default: 'qwen3.5:4b',
                }
            },
            strict: true,
            allowPositionals: true
        })

        if (values.help) {
            logger.logUsage()
            process.exit(0)
        }

        if (positionals.length === 0 || typeof positionals[0] == 'undefined' || !positionals[0]) {
            logger.logUsage()
            process.exit(1)
        }

        return {
            ollamaHost: values.host,
            ollamaModel: values.model,
            serverScriptPath: positionals[0]
        }
    }
}