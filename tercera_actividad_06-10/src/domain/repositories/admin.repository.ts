import { Admin } from '../models/admin.model'

export interface AdminRepository {
  create(admin: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void
  update(id: string, admin: Partial<Admin>): Promise<Admin | null>
  getById(id: string): Promise<Admin | null>
  getByEmail(email: string): Promise<Admin | null>
  getAll(): Promise<Admin[]>
  delete(id: string): Promise<boolean>
}