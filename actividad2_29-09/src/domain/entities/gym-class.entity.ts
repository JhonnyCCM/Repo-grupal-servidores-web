import type { Coach } from './coach.entity.js'
import type { User } from './user.entity.js'
import type { DifficultyLevel, ICategory, IRoom, IScheduleItem } from '../value-objects.js'

export class GymClass {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public coachId: Coach,
    public category: ICategory,
    public capacity: number,
    public isActive: boolean = false,
    public createdAt: Date = new Date(),
    public room: IRoom,
    public difficultyLevel: DifficultyLevel,
    public schedule: IScheduleItem[],
    public imageUrl?: string,
    public updatedAt?: Date,
    public enrolledMembers: User[] = [],
  ) {}
}
