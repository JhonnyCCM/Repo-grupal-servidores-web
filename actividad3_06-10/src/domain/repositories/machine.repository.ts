import { Machine } from '../models/machine.model'

export interface MachineRepository {
  create(
    machine: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>,
    callback: (error: Error | null, result?: string) => void,
  ): void
  update(id: string, machine: Partial<Machine>): Promise<Machine | null>
  getById(id: string): Promise<Machine | null>
  getByStatus(status: string): Promise<Machine[]>
  getAll(): Promise<Machine[]>
  delete(id: string): Promise<boolean>
}
