import kleur from 'kleur'
import ollama from 'ollama'

const args = process.argv.slice(2)
const modelName = args[0] || 'gemma3n:e4b'

console.log(`Usage:
  mcp-client <model-name>
`)

console.log(kleur.grey(`Ollama host: http://localhost:11434
Model: ${modelName}
`))

const message = { role: 'user', content: 'Hello' }
console.log('Message: ', message.content)

const response = await ollama.chat({
    model: modelName,
    messages: [message],
    stream: true,
})

for await (const chunk of response) {
    process.stdout.write(kleur.yellow(chunk.message.content))
}