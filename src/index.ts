import 'dotenv/config'
import * as express from 'express'
import { postgreSqlDataSource } from './db'
import { Routes } from './adapters/api'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import { createSessionConfig } from './libs/cookie/sessiondb.config'
import { CustomSessionStore } from './libs/cookie/session-store'

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
  app.use(cookieParser())
  app.use(session(createSessionConfig(new CustomSessionStore())))

  new Routes(app)

  app.listen(port, () => {
    console.info(`🚀 Express is running at http://${host}:${port}`)
  })
}

startServer().catch((err) => {
  console.error(err)
})
