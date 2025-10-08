import { User } from '../models/user.model'

export interface UserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void
  update(id: string, user: Partial<User>): Promise<User | null>
  getById(id: string): Promise<User | null>
  getByEmail(email: string): Promise<User | null>
  getAll(): Promise<User[]>
  delete(id: string): Promise<boolean>
}