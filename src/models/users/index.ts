import { Users } from './entity/users.entity'
import { postgreSqlDataSource } from '../../db'
import { hashPassword } from '../../utilts/bcrypt'
import { UserValidator } from '../../validators/user-validator'
import Models from '../../models/index'
import { IUser } from './interface'

export class UsersModel {
  private usersRepository = postgreSqlDataSource.getRepository(Users)
  private userValidator = new UserValidator()

  async create(user: any) {
    const isValid = await this.userValidator.validate(user)

    if (isValid.ok == false) {
      return { ok: isValid.ok, message: isValid.message }
    }

    const checkExistence = await this.checkExistence(user.phone, user.email)

    if (checkExistence.ok == false) {
      return { ok: checkExistence.ok, message: checkExistence.message }
    }

    const newUser = await this.usersRepository.save({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: await hashPassword(user.password),
      roleId: user.roleId
    })

    const balance = user.roleId === 1 ? 0 : 1000000

    await Models.TokensModel.create(newUser.id, balance)

    return {
      ok: true,
      user: {
        id: newUser.id,
        roleId: newUser.roleId,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        dateCreate: newUser.dateCreate
      }
    }
  }

  async getUserById(id: number) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne()
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email })
      .getOne()
  }

  async getUserByPhone(phone: string) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.phone = :phone', { phone })
      .getOne()
  }

  async checkExistence(phone: string, email: string) {
    const emailUser = await this.getUserByEmail(email)

    const phoneUser = await this.getUserByPhone(phone)

    if (emailUser || phoneUser) {
      return {
        ok: false,
        message: 'User with this email or phone already exists'
      }
    } else {
      return { ok: true }
    }
  }

  async findAll() {
    return await this.usersRepository.createQueryBuilder('users').getMany()
  }

  async updateById(id: number, updateData: Partial<IUser>) {
    const isValid = await this.userValidator.validate(updateData)

    if (isValid.ok == false) {
      return { ok: isValid.ok, message: isValid.message }
    }

    return await this.usersRepository.update(id, updateData)
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id)
  }

  async isAdmin(userId: number) {
    const user = await this.getUserById(userId)

    if (user.roleId == 0) {
      return true
    } else return false
  }

  async getAdmins() {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.roleId = 0')
      .getMany()
  }
}
