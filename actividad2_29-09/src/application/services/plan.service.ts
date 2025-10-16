import { Plan } from "../../domain/entities/plan.entity.js";
import type { PlanRepository } from "../../domain/repositories/plan.repository.js";

export class PlanService {
    constructor(private readonly planRepository: PlanRepository) {}
    createPlan(plan: Omit<Plan, "id" | "createdAt" | "updatedAt">, callback: (error: Error | null, result?: string) => void): void {
        if (!plan.name || !plan.price || !plan.durationInMonths) {
            return callback(new Error("Name, price, and duration are required"));
        }
        this.planRepository.create(plan, callback);
    }
    updatePlan(id: string, plan: Partial<Plan>): Promise<Plan | null> {
        return this.planRepository.update(id, plan);
    }
    getPlanById(id: string): Promise<Plan | null> {
        return this.planRepository.getById(id);
    }
    getAllPlans(): Promise<Plan[]> {
        return this.planRepository.getAll();
    }
    getActivePlans(): Promise<Plan[]> {
        return this.planRepository.getActivePlans();
    }
    deletePlan(id: string): Promise<boolean> {
        return this.planRepository.delete(id);
    }
}