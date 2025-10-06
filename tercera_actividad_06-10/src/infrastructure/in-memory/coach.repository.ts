import { Coach } from '../../domain/entities/coach.entity.js'
import type { CoachRepository } from '../../domain/repositories/coach.repository.js'
import { v4 as uuid } from 'uuid'

const coaches: Coach[] = []

export class InMemoryCoachRepository implements CoachRepository {
  create(coach: Omit<Coach, 'id'>, callback: (error: Error | null, result?: string) => void): void {
    setTimeout(() => {
      try {
        const newCoach = new Coach(
          uuid(),
          coach.fullName,
          coach.email,
          coach.phone,
          coach.passwordHash,
          coach.createdAt,
          coach.updatedAt,
          coach.specialities ?? [],
          coach.isActive,
          coach.biography,
          coach.imageUrl,
          coach.classes ?? [],
          coach.classesTaught,
          coach.experienceYears,
        )
        coaches.push(newCoach)
        callback(null, newCoach.id)
      } catch (error) {
        callback(error as Error)
      }
    }, 500)
  }

  update(id: string, coach: Partial<Coach>): Promise<Coach | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = coaches.findIndex((c) => c.id === id)
        if (index === -1) {
          return resolve(null)
        }
        const updatedCoach = { ...coaches[index], ...coach } as Coach
        coaches[index] = updatedCoach
        resolve(updatedCoach)
      }, 500)
    })
  }

  async getById(id: string): Promise<Coach | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return coaches.find((c) => c.id === id) || null
  }

  async getAll(): Promise<Coach[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return coaches
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = coaches.findIndex((c) => c.id === id)
    if (index === -1) {
      return false
    }
    coaches.splice(index, 1)
    return true
  }
}
