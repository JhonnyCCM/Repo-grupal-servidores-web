import { Role, type ISpeciality } from '../value-objects.js'
import type { GymClass } from './gym-Class.entity.js'
import { BaseUser } from './base-user.entity.js'

export class Coach extends BaseUser {
  constructor(
    id: string,
    fullName: string,
    email: string,
    phone: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date,
    public specialities: ISpeciality[],
    public isActive: boolean = true,
    public biography: string,
    public imageUrl: string,
    public classes: GymClass[],
    public classesTaught: number = 0,
    public experienceYears: number = 0,
  ) {
    super(id, fullName, email, phone, Role.COACH, passwordHash, createdAt, updatedAt)
  }
}
