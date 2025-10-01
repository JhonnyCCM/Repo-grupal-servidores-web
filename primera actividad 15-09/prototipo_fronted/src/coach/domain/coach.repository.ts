import type { Coach } from './coach.entity'

export interface CoachRepository {
  getAll(): Promise<Coach[]>
  getById(id: number, callback: (error: Error | null, coach: Coach | null) => void): void
  create(newCoach: Omit<Coach, 'id'>): Promise<Coach>
  update(id: number, updates: Partial<Omit<Coach, 'id'>>): Promise<Coach | null>
  delete(id: number): Promise<boolean>
}
