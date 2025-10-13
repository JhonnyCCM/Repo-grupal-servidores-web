import { Plan } from '../../domain/entities/plan.entity.js'
import type { PlanRepository } from '../../domain/repositories/plan.repository.js'
import { v4 as uuid } from 'uuid'

const plans: Plan[] = []

export class InMemoryPlanRepository implements PlanRepository {
  create(plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void {
    setTimeout(() => {
      try {
        const newPlan: Plan = {
          id: uuid(),
          name: plan.name,
          description: plan.description,
          price: plan.price,
          durationInMonths: plan.durationInMonths,
          features: plan.features,
          isActive: plan.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        plans.push(newPlan)
        callback(null, newPlan.id)
      } catch (error) {
        callback(error as Error)
      }
    }, 500)
  }

  update(id: string, plan: Partial<Plan>): Promise<Plan | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = plans.findIndex((p) => p.id === id)
        if (index === -1) {
          return resolve(null)
        }
        const updatedPlan = { ...plans[index], ...plan, updatedAt: new Date() } as Plan
        plans[index] = updatedPlan
        resolve(updatedPlan)
      }, 500)
    })
  }

  async getById(id: string): Promise<Plan | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return plans.find((p) => p.id === id) || null
  }

  async getAll(): Promise<Plan[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return plans
  }

  async getActivePlans(): Promise<Plan[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return plans.filter((p) => p.isActive)
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = plans.findIndex((p) => p.id === id)
    if (index === -1) {
      return false
    }
    plans.splice(index, 1)
    return true
  }
}