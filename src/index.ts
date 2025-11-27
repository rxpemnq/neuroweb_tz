import 'dotenv/config'
import * as express from 'express'
import { postgreSqlDataSource } from './db'

const port = process.env.PORT
const host = process.env.HOST

async function startServer() {
  await postgreSqlDataSource
    .initialize()
    .then(() => {
      console.log('✅ Connected to PostgreSql')
    })
    .catch((err) => {
      console.error(err)
    })

  const app = express()

  app.use(express.json())

  app.listen(port, () => {
    console.info(`🚀 Express is running at http://${host}:${port}`)
  })
}

startServer().catch((err) => {
  console.error(err)
})
