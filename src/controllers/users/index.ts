import { UsersModel } from '../../models/users'
import { IUser } from '../../models/users/interface'
import { UserValidator } from '../../validators/user-validator'

export class UsersControllers {
  private usersModels = new UsersModel()
  private userValidator = new UserValidator()

  async createUser(user: IUser) {
    const isValid = await this.userValidator.validate(user)

    if (isValid.ok == false) {
      return isValid
    } else {
      return await this.usersModels.create(user)
    }
  }

  async getUserById(id: number) {
    return await this.usersModels.getUserById(id)
  }

  async findAll() {
    return await this.usersModels.findAll()
  }

  async updateById(id: number, updateData: Partial<IUser>) {
    const isValid = await this.userValidator.validate(updateData)

    if (isValid.ok == false) {
      return { ok: isValid.ok, message: isValid.message }
    } else {
      const result = await this.usersModels.updateById(id, updateData)

      return { ok: isValid.ok, result }
    }
  }

  async removeById(id: number) {
    return await this.usersModels.remove(id)
  }
}
