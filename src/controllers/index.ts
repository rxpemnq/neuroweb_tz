import { AuthController } from './auth'
import { TokensController } from './tokens'
import { UsersControllers } from './users'

export default {
  UsersContoller: new UsersControllers(),
  TokensController: new TokensController(),
  AuthController: new AuthController()
}
