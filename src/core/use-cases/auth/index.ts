import { IUser } from '../../../models/users/interface'
import Models from '../../../models/index'
import { comparePassword } from '../../../utilts/bcrypt'

export class AuthCase {
  async signIn(userData: Partial<IUser>): Promise<any> {
    const user = await Models.UsersModel.getUserByEmail(userData.email)

    if (user && (await comparePassword(userData.password, user.password))) {
      return {
        ok: true,
        message: 'Successfully logged in',
        user
      }
    } else {
      return {
        ok: false,
        message: 'User or password arent valid',
        user
      }
    }
  }

  async signUp(user: IUser) {
    const newUser = await Models.UsersModel.create(user)

    return {
      ok: newUser.ok,
      message: newUser.message,
      newUser: newUser.user
    }
  }
}
