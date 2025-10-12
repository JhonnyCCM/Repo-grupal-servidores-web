import type { ISpeciality } from '../value-objects.js'
import type { GymClass } from './gym-class.entity.js'

export class Coach {
  constructor(
    public id: string,
    public fullName: string,
    public email: string,
    public phone: string,
    public password: string,
    public gender: string,
    public birthDate: Date,
    public createdAt: Date = new Date(),
    public specialities: ISpeciality[],
    public isActive: boolean = true,
    public biography: string,
    public experienceYears: number,
    public imageUrl?: string,
    public classes: GymClass[] = [],
    public updatedAt?: Date,
  ) {}
}
