import { Routine } from '../models/routine.model'

export interface RoutineRepository {
  create(routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void
  update(id: string, routine: Partial<Routine>): Promise<Routine | null>
  getById(id: string): Promise<Routine | null>
  getByMachineId(machineId: string): Promise<Routine[]>
  getByDifficulty(difficulty: string): Promise<Routine[]>
  getAll(): Promise<Routine[]>
  delete(id: string): Promise<boolean>
}