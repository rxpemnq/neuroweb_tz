import Models from '../../models/index'
import { IUser } from '../../models/users/interface'

export class UsersControllers {
  async create(user: IUser) {
    const newUser = await Models.UsersModel.create(user)

    return {
      ok: true,
      user: {
        id: newUser.user.id,
        roleId: newUser.user.roleId,
        name: newUser.user.name,
        email: newUser.user.email,
        phone: newUser.user.phone,
        dateCreate: newUser.user.dateCreate
      }
    }
  }

  async getUserById(id: number) {
    return await Models.UsersModel.getUserById(id)
  }

  async findAll() {
    return await Models.UsersModel.findAll()
  }

  async updateById(id: number, updateData: Partial<IUser>) {
    const result = await Models.UsersModel.updateById(id, updateData)

    return { ok: true, result }
  }

  async removeById(id: number) {
    return await Models.UsersModel.remove(id)
  }
}
