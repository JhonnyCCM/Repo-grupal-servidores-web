import type { Role } from '../value-objects.js'

export abstract class BaseUser {
  constructor(
    public id: string,
    public fullName: string,
    public email: string,
    public phone: string,
    public role: Role,
    public passwordHash: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
