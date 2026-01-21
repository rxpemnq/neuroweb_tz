import { postgreSqlDataSource } from '../../db'
import Models from '../../models/index'
import { Tokens } from './entity/tokens.entity'

export class TokensModel {
  private tokensRepository = postgreSqlDataSource.getRepository(Tokens)

  async create(userId: number, balance: number) {
    const user = await Models.UsersModel.getUserById(userId)

    if (user) {
      return await this.tokensRepository.save({
        balance,
        user: user,
        dateCreate: new Date()
      })
    }
  }

  async getTokensByUserId(userId: number) {
    return await this.tokensRepository
      .createQueryBuilder('tokens')
      .where('tokens.userId = :userId', { userId })
      .getOne()
  }

  async findAll() {
    return await this.tokensRepository.createQueryBuilder('tokens').getMany()
  }

  async operateWithTokensByUserId(
    userId: number,
    amount: number,
    addTokens: boolean
  ) {
    const tokens = await this.getTokensByUserId(userId)

    switch (addTokens) {
      case true:
        if (tokens.balance == 0) {
          await this.tokensRepository.update(tokens.id, {
            balance: amount,
            dateUpdate: new Date()
          })

          return { ok: true }
        } else {
          await this.tokensRepository.update(tokens.id, {
            balance: (amount += tokens.balance),
            dateUpdate: new Date()
          })

          return { ok: true }
        }

      case false:
        if (tokens.balance == 0) {
          return { ok: false, message: 'Not enough tokens to subtract' }
        } else {
          await this.tokensRepository.update(tokens.id, {
            balance: tokens.balance - amount,
            dateUpdate: new Date()
          })

          return { ok: true }
        }
    }
  }

  async removeByUserId(userId: number) {
    const tokens = await this.getTokensByUserId(userId)

    return await this.tokensRepository.update(tokens.id, {
      balance: 0,
      dateUpdate: new Date()
    })
  }

  async transferTokens(
    requesterId: number,
    responserId: number,
    amount: number
  ) {
    const subtractTokens = await this.operateWithTokensByUserId(
      responserId,
      amount,
      false
    )

    if (subtractTokens.ok == true) {
      const addTokens = await this.operateWithTokensByUserId(
        requesterId,
        amount,
        true
      )

      if (addTokens.ok == true) {
        return { ok: true }
      }
    } else {
      return { ok: false, message: 'Internal server error' }
    }
  }

  async requestTokens(userId: number, amount: number) {
    const user = await Models.UsersModel.getUserById(userId)

    if (!user) {
      return { ok: false, message: 'User not found' }
    }

    if (user.roleId == 0) {
      return { ok: false, message: 'Admins cannot request tokens' }
    }

    const admins = await Models.UsersModel.getAdmins()

    if (admins.length == 0) {
      return { ok: false, message: 'You have no admins avaliable' }
    }

    for (const admin of admins) {
      const tokens = await this.getTokensByUserId(admin.id)

      if (tokens.balance >= amount) {
        const result = await this.transferTokens(user.id, admin.id, amount)

        if (result.ok == true) {
          return { ok: true }
        }
      }
    }

    return { ok: false, message: 'No admins found with needed balance' }
  }
}
