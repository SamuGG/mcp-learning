import { parseArgs } from 'util'
import logger from './main-logger'

export interface Settings {
    ollamaHost: string
    ollamaModel: string
    serverScriptPath: string
}

export default {
    parseArgs: function (): Settings {
        let values: { help?: boolean; host?: string; model?: string }
        let positionals: string[]

        try {
            ({ values, positionals } = parseArgs({
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
            }))
        } catch (e) {
            logger.logUsage()
            process.exit(1)
        }

        if (values.help) {
            logger.logUsage()
            process.exit(0)
        }

        if (positionals.length !== 1 || !positionals[0]) {
            logger.logUsage()
            process.exit(1)
        }

        return {
            ollamaHost: values.host!,
            ollamaModel: values.model!,
            serverScriptPath: positionals[0]
        }
    }
}