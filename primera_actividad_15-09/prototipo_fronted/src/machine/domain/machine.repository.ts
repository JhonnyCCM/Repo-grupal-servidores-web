import type { Machine } from './machine.entity'

export interface MachineRepository {
  getAll(): Promise<Machine[]>
  getById(id: number): Promise<Machine | null>
  create(newMachine: Omit<Machine, 'id'>, callback: (error: Error | null, machine: Machine) => void): void
  update(id: number, updates: Partial<Omit<Machine, 'id'>>): Promise<Machine | null>
  delete(id: number): Promise<boolean>
}
