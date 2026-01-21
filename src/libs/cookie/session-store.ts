import * as session from 'express-session'
import Models from '../../models/index'

export class CustomSessionStore extends session.Store {
  async get(
    sid: string,
    callback: (err: any, session?: session.SessionData | null) => void
  ): Promise<void> {
    const response = await Models.SessionsModel.readSession(sid)

    if (!response) return callback(null, null)

    const dateNow = Math.round(Date.now() / 1000)

    if (response.expires < dateNow) return callback(null, null)

    const data = response.session

    return callback(null, JSON.parse(data))
  }

  async set(
    sid: string,
    session: session.SessionData,
    callback?: (err?: any) => void
  ): Promise<void> {
    let expires

    if (session.cookie) {
      if (session.cookie.expires) {
        expires = session.cookie.expires
      }
    }

    if (!expires) {
      expires = Date.now()
    }

    if (!(expires instanceof Date)) {
      expires = new Date(expires)
    }

    expires = Math.round(expires.getTime() / 1000)
    const data = JSON.stringify(session)

    await Models.SessionsModel.createSession({
      sid,
      expires,
      session: data
    })

    if (callback) {
      callback()
    }
  }

  async destroy(sid: string): Promise<void> {
    await Models.SessionsModel.deleteSession({ sid: sid })
  }
}
