import { Users } from './entity/users.entity'
import { postgreSqlDataSource } from '../../db'

export class UsersModel {
  private usersRepository = postgreSqlDataSource.getRepository(Users)

  async create(user: any) {
    return await this.usersRepository.save(user)
  }

  async getUserById(id: number) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne()
  }

  async findAll() {
    return await this.usersRepository.createQueryBuilder('users').getMany()
  }

  async updateById(id: number, data: any) {
    return await this.usersRepository.update(id, data)
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id)
  }
}
