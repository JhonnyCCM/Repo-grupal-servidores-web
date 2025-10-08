import { IFavoriteItem } from '../value-objects.js'

export class User {
  constructor(
    public id: string,
    public fullName: string,
    public email: string,
    public phone: string,
    public gender: string,
    public birthDate: Date,
    public password: string,
    public createdAt: Date = new Date(),
    public membershipType: string,
    public isActive: boolean = true,
    public favorites: IFavoriteItem[] = [],
    public updatedAt?: Date,
    public imageUrl?: string,
  ) {}
}
