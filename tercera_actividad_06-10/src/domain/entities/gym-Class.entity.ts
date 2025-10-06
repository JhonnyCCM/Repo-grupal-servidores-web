import type { Coach } from './coach.entity.js'
import type { DifficultyLevel, ICategory, IRoom, IScheduleItem } from '../value-objects.js'

export class GymClass {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public coach: Coach,
    public category: ICategory,
    public duration: number,
    public imageUrl: string,
    public capacity: number,
    public enrolledMembers: number,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public room: IRoom,
    public difficultyLevel: DifficultyLevel,
    public schedule: IScheduleItem[],
  ) {}
}
