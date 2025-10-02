import type { Class } from './class.entity'

export interface ClassRepository {
  getAll(callback: (error: Error | null, classes: Class[]) => void): void
  getById(id: number): Promise<Class | null>
  create(newClass: Omit<Class, 'id'>): Promise<Class>
  update(id: number, updates: Partial<Omit<Class, 'id'>>): Promise<Class | null>
  delete(id: number): Promise<boolean>
}
