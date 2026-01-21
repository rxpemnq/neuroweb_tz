import { OpenRouter } from '@openrouter/sdk'

export class Openrouter {
  openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
  })

  async makeRequest(content: string) {
    console.log('content', content)

    const completion = await this.openRouter.chat.send({
      model: 'xiaomi/mimo-v2-flash:free',
      messages: [
        {
          role: 'user',
          content
        }
      ],
      stream: false
    })

    console.log('completion', completion)

    return completion
  }
}
