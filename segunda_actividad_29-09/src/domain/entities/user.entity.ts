export class User {
  constructor(
    public id: string,
    public fullName: string,
    public email: string,
    public password: string,
    public phone: string,
    public gender: string,
    public birthDate: Date,
    public membershipType: string,
    public createdAt: Date = new Date(),
    public isActive: boolean = true,
    public enrolledClasses: string[] = [],
    public updatedAt?: Date,
    public imageUrl?: string,
  ) {}
}
