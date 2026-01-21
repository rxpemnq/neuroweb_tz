import { SessionsModel } from './sessions'
import { TokensModel } from './tokens'
import { UsersModel } from './users'

export default {
  UsersModel: new UsersModel(),
  TokensModel: new TokensModel(),
  SessionsModel: new SessionsModel()
}
