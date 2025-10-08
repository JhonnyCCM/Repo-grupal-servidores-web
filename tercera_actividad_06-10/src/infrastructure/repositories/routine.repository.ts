import { Routine } from '../../domain/models/routine.model'
import type { RoutineRepository } from '../../domain/repositories/routine.repository'
import { v4 as uuid } from 'uuid'

const routines: Routine[] = []

export class InMemoryRoutineRepository implements RoutineRepository {
  create(routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void {
    setTimeout(() => {
      try {
        const newRoutine: Routine = {
          id: uuid(),
          name: routine.name,
          description: routine.description,
          machineId: routine.machineId,
          exercises: routine.exercises,
          animationsUrls: routine.animationsUrls,
          difficulty: routine.difficulty,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        routines.push(newRoutine)
        callback(null, newRoutine.id)
      } catch (error) {
        callback(error as Error)
      }
    }, 500)
  }

  update(id: string, routine: Partial<Routine>): Promise<Routine | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = routines.findIndex((r) => r.id === id)
        if (index === -1) {
          return resolve(null)
        }
        const updatedRoutine = { ...routines[index], ...routine, updatedAt: new Date() } as Routine
        routines[index] = updatedRoutine
        resolve(updatedRoutine)
      }, 500)
    })
  }

  async getById(id: string): Promise<Routine | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return routines.find((r) => r.id === id) || null
  }

  async getByMachineId(machineId: string): Promise<Routine[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return routines.filter((r) => r.machineId === machineId)
  }

  async getByDifficulty(difficulty: string): Promise<Routine[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return routines.filter((r) => r.difficulty === difficulty)
  }

  async getAll(): Promise<Routine[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return routines
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = routines.findIndex((r) => r.id === id)
    if (index === -1) {
      return false
    }
    routines.splice(index, 1)
    return true
  }
}