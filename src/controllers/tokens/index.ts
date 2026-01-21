import Models from '../../models/index'

export class TokensController {
  async create(userId: number, balance: number) {
    return await Models.TokensModel.create(userId, balance)
  }

  async getTokensByUserId(userId: number) {
    return await Models.TokensModel.getTokensByUserId(userId)
  }

  async findAll() {
    return await Models.TokensModel.findAll()
  }

  async removeByUserId(userId: number) {
    return await Models.TokensModel.removeByUserId(userId)
  }

  async operateWithTokensByUserId(
    userId: number,
    balance: number,
    addTokens: boolean
  ) {
    return await Models.TokensModel.operateWithTokensByUserId(
      userId,
      balance,
      addTokens
    )
  }

  async requestTokens(userId: number, amount: number) {
    return await Models.TokensModel.requestTokens(userId, amount)
  }
}
