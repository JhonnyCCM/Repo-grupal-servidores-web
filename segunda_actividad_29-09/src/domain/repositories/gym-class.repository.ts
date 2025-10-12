import { GymClass } from '../entities/gym-class.entity.js'

export interface GymClassRepository {
  create(
    gymClass: Omit<GymClass, 'id' | 'createdAt' | 'updatedAt'>,
    callback: (error: Error | null, result?: string) => void,
  ): void
  update(id: string, gymClass: Partial<GymClass>): Promise<GymClass | null>
  getById(id: string): Promise<GymClass | null>
  getByCoachId(coachId: string): Promise<GymClass[]>
  getActiveClasses(): Promise<GymClass[]>
  getAll(): Promise<GymClass[]>
  delete(id: string): Promise<boolean>
}
