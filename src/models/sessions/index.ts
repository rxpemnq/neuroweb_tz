import { postgreSqlDataSource } from '../../db'
import { Sessions } from './entity/sessions.entity'
import { ISession } from './interface'

export class SessionsModel {
  private sessionRepository = postgreSqlDataSource.getRepository(Sessions)

  async createSession(sessionData: ISession) {
    return await this.sessionRepository.save({
      sid: sessionData.sid,
      session: sessionData.session,
      expires: sessionData.expires
    })
  }

  async readSession(sid: any) {
    return await this.sessionRepository
      .createQueryBuilder('session')
      .where('sid = :sid', { sid: sid })
      .getOne()
  }

  async updateSession({ sid, ...params }: Partial<ISession>) {
    return await this.sessionRepository.update(sid, params)
  }

  async deleteSession(sid: any) {
    return await this.sessionRepository.delete({ sid: sid })
  }
}
