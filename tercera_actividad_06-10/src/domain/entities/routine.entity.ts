import type { DifficultyLevel } from '../value-objects.js'

export class Routine {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public machineId: string,
    public exercises: string[],
    public animationsUrls: string[],
    public difficulty: DifficultyLevel,
    public createdAt: Date = new Date(),
    public updatedAt?: Date,
  ) {}
}