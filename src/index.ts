import 'dotenv/config'
import * as express from 'express'

const port = process.env.PORT
const host = process.env.HOST

async function startServer() {
  const app = express()

  app.use(express.json())

  app.listen(port, () => {
    console.info(`🚀 Express is running at http://${host}:${port}`)
  })
}

startServer().catch((err) => {
  console.error(err)
})
