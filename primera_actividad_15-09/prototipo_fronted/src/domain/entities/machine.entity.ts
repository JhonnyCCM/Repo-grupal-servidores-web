import type { IRoom, ISpeciality, Status } from '../value-objects.js'

export class Machine {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public specialities: ISpeciality[],
    public createdAt: Date = new Date(),
    public room: IRoom[],
    public status: Status,
    public updatedAt?: Date,
    public imageUrl?: string,
  ) {}
}
