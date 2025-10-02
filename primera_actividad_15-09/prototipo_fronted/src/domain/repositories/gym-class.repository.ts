import { GymClass } from '../entities/gym-Class.entity.js'

export interface GymClassRepository {
  create(
    gymClass: Omit<GymClass, 'id'>,
    callback: (error: Error | null, result?: string) => void,
  ): void
  update(id: string, gymClass: Partial<GymClass>): Promise<GymClass | null>
  getById(id: string): Promise<GymClass | null>
  getAll(): Promise<GymClass[]>
  delete(id: string): Promise<boolean>
}
