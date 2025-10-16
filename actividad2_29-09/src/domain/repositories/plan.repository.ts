import { Plan } from '../entities/plan.entity.js'

export interface PlanRepository {
  create(plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void
  update(id: string, plan: Partial<Plan>): Promise<Plan | null>
  getById(id: string): Promise<Plan | null>
  getAll(): Promise<Plan[]>
  getActivePlans(): Promise<Plan[]>
  delete(id: string): Promise<boolean>
} 