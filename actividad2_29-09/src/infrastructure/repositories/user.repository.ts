import { User } from '../../domain/entities/user.entity.js'
import type { UserRepository } from '../../domain/repositories/user.repository.js'
import { v4 as uuid } from 'uuid'

const users: User[] = []

export class InMemoryUserRepository implements UserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void {
    setTimeout(() => {
      try {
        const newUser: User = {
          id: uuid(),
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          phone: user.phone,
          gender: user.gender,
          birthDate: user.birthDate,
          membershipType: user.membershipType,
          imageUrl: user.imageUrl,
          isActive: user.isActive ?? true,
          enrolledClasses: user.enrolledClasses,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        users.push(newUser)
        callback(null, newUser.id)
      } catch (error) {
        callback(error as Error)
      }
    }, 500)
  }

  update(id: string, user: Partial<User>): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = users.findIndex((u) => u.id === id)
        if (index === -1) {
          return resolve(null)
        }
        const updatedUser = { ...users[index], ...user, updatedAt: new Date() } as User
        users[index] = updatedUser
        resolve(updatedUser)
      }, 500)
    })
  }

  async getById(id: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return users.find((u) => u.id === id) || null
  }

  async getByEmail(email: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return users.find((u) => u.email === email) || null
  }

  async getAll(): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return users
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) {
      return false
    }
    users.splice(index, 1)
    return true
  }
}