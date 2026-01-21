import validator from 'validator'
import { IUser } from '../models/users/interface'

export class UserValidator {
  async validate(user: Partial<IUser>) {
    if (user.email != undefined) {
      if (!validator.isEmail(user.email)) {
        return { ok: false, message: 'Invalid email format' }
      }
    }

    if (user.phone != undefined) {
      if (!validator.isMobilePhone(user.phone, 'any')) {
        return { ok: false, message: 'Invalid phone number' }
      }
    }

    if (user.name != undefined) {
      if (!validator.isLength(user.name, { min: 2, max: 50 })) {
        return {
          ok: false,
          message: 'Name must be between 2 and 50 characters'
        }
      }
    }

    if (user.password != undefined) {
      if (!validator.isLength(user.password, { min: 6 })) {
        return { ok: false, message: 'Password must be at least 6 characters' }
      }
    }

    if (user.roleId != undefined) {
      if (!validator.isInt(user.roleId.toString(), { min: 0, max: 1 })) {
        return { ok: false, message: 'Role ID must be 0 or 1' }
      }
    }

    return { ok: true }
  }
}
