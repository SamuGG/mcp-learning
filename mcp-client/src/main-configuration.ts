import { parseArgs } from 'util'
import logger from './main-logger'

export interface Settings {
    mlxEndpoint: string
    mlxModel: string
    serverScriptPath: string
}

export default {
    parseArgs: function (): Settings {
        let values: { help?: boolean; endpoint?: string; model?: string }
        let positionals: string[]

        try {
            ({ values, positionals } = parseArgs({
                args: Bun.argv.slice(2),
                options: {
                    help: {
                        type: 'boolean',
                        default: false
                    },
                    endpoint: {
                        type: 'string',
                        short: 'e',
                        default: 'http://localhost:8080/v1',
                    },
                    model: {
                        type: 'string',
                        short: 'm',
                        default: 'mlx-community/Qwen3.5-4B-8bit',
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
            mlxEndpoint: values.endpoint!,
            mlxModel: values.model!,
            serverScriptPath: positionals[0]
        }
    }
}