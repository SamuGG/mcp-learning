import config from './main-configuration'
import { AIChat } from './chat'

async function main() {
    const settings = config.parseArgs()
    const chat = new AIChat(settings)

    try {
        await chat.initializeMCP()
        await chat.chatLoop()
    } catch (e) {
        console.error('Error:', e)
        process.exit(1)
    } finally {
        await chat.cleanup()
    }
}

main()