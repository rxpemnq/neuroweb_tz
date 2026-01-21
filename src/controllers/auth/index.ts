import { AuthCase } from '../../core/use-cases/auth'
import { IUser } from '../../models/users/interface'
import { sign } from 'jsonwebtoken'

export class AuthController {
  private authCase = new AuthCase()

  async signUp(user: IUser) {
    return await this.authCase.signUp(user)
  }

  async signIn(user: Partial<IUser>) {
    return await this.authCase.signIn(user)
  }

  createJwtToken(data: any) {
    return sign(data, process.env.JWT_SECRET, { expiresIn: '30d' })
  }
}
