import { CustomSessionStore } from '../../../libs/cookie/session-store'
import { JwtPayload, verify } from 'jsonwebtoken'

export class Guard {
  private customSessionStore: CustomSessionStore

  async checkAuth(req: any): Promise<boolean> {
    const { sessionID, session } = req

    if (!sessionID || !session.cookie._expires) {
      return false
    }

    const now = Date.now()
    const expires = new Date(session.cookie._expires).getTime()

    if (now >= expires) {
      await this.customSessionStore.destroy(sessionID)
      return false
    }

    if (!session.jwt) {
      return false
    }

    const token = session.jwt

    if (!token) {
      return false
    }

    const payload = verify(token, process.env.JWT_SECRET)

    if ((payload as JwtPayload).roleId == 0) {
      req['user'] = payload

      return true
    } else {
      return false
    }
  }
}
