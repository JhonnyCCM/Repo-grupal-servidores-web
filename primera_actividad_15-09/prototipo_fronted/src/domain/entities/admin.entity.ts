import { Role } from '../value-objects'
import { BaseUser } from './base-user.entity'

export class Admin extends BaseUser {
  constructor(
    id: string,
    fullName: string,
    email: string,
    phone: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, fullName, email, phone, Role.ADMIN, passwordHash, createdAt, updatedAt)
  }
}
