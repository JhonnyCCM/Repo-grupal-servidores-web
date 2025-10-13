import { Coach } from '../entities/coach.entity.js'

export interface CoachRepository {
  create(coach: Omit<Coach, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void
  update(id: string, coach: Partial<Coach>): Promise<Coach | null>
  getById(id: string): Promise<Coach | null>
  getByEmail(email: string): Promise<Coach | null>
  getAll(): Promise<Coach[]>
  delete(id: string): Promise<boolean>
}
