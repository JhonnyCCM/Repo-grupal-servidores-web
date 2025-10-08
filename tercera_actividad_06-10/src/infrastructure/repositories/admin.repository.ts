import { Admin } from '../../domain/models/admin.model'
import type { AdminRepository } from '../../domain/repositories/admin.repository'
import { v4 as uuid } from 'uuid'

const admins: Admin[] = []

export class InMemoryAdminRepository implements AdminRepository {
  create(admin: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void {
    setTimeout(() => {
      try {
        const newAdmin: Admin = {
          id: uuid(),
          email: admin.email,
          password: admin.password,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        admins.push(newAdmin)
        callback(null, newAdmin.id)
      } catch (error) {
        callback(error as Error)
      }
    }, 500)
  }

  update(id: string, admin: Partial<Admin>): Promise<Admin | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = admins.findIndex((a) => a.id === id)
        if (index === -1) {
          return resolve(null)
        }
        const updatedAdmin = { ...admins[index], ...admin, updatedAt: new Date() } as Admin
        admins[index] = updatedAdmin
        resolve(updatedAdmin)
      }, 500)
    })
  }

  async getById(id: string): Promise<Admin | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return admins.find((a) => a.id === id) || null
  }

  async getByEmail(email: string): Promise<Admin | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return admins.find((a) => a.email === email) || null
  }

  async getAll(): Promise<Admin[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return admins
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = admins.findIndex((a) => a.id === id)
    if (index === -1) {
      return false
    }
    admins.splice(index, 1)
    return true
  }
}