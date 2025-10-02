import { BaseUser } from './base-user.entity'
import { Role } from '../value-objects'

export class User extends BaseUser {
  constructor(
    id: string,
    fullName: string,
    email: string,
    phone: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date,
    public membershipType: string,
    public membershipEndDate: Date,
  ) {
    super(id, fullName, email, phone, Role.MEMBER, passwordHash, createdAt, updatedAt)
  }
}
