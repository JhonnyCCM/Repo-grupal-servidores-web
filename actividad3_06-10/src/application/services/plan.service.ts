import { AppDataSource } from '../../presentation/data-source'
import { Plan } from '../../domain/models/plan.model'

export class PlanService {
    private planRepository = AppDataSource.getRepository(Plan)

    async createPlan(planData: Partial<Plan>): Promise<Plan> {
        if (!planData.name || !planData.price || !planData.durationInMonths) {
            throw new Error('Plan name, price, and duration are required')
        }

        if (planData.price <= 0) {
            throw new Error('Price must be greater than 0')
        }

        if (planData.durationInMonths <= 0) {
            throw new Error('Duration must be greater than 0 months')
        }

        const plan = this.planRepository.create({
            ...planData,
            features: planData.features || [],
            isActive: planData.isActive ?? true
        })
        return await this.planRepository.save(plan)
    }

    async updatePlan(id: string, planData: Partial<Plan>): Promise<Plan | null> {
        if (planData.price && planData.price <= 0) {
            throw new Error('Price must be greater than 0')
        }

        if (planData.durationInMonths && planData.durationInMonths <= 0) {
            throw new Error('Duration must be greater than 0 months')
        }

        await this.planRepository.update(id, planData)
        return this.getPlanById(id)
    }

    async getPlanById(id: string): Promise<Plan | null> {
        return await this.planRepository.findOne({
            where: { id }
        })
    }

    async getAllPlans(): Promise<Plan[]> {
        return await this.planRepository.find()
    }

    async getActivePlans(): Promise<Plan[]> {
        return await this.planRepository.find({
            where: { isActive: true }
        })
    }

    async getPlansByDuration(durationInMonths: number): Promise<Plan[]> {
        return await this.planRepository.find({
            where: { durationInMonths, isActive: true }
        })
    }

    async getPlansByPriceRange(minPrice: number, maxPrice: number): Promise<Plan[]> {
        return await this.planRepository
            .createQueryBuilder('plan')
            .where('plan.price >= :minPrice AND plan.price <= :maxPrice')
            .andWhere('plan.isActive = :isActive')
            .setParameters({ minPrice, maxPrice, isActive: true })
            .getMany()
    }

    async activatePlan(id: string): Promise<boolean> {
        const result = await this.planRepository.update(id, { isActive: true })
        return result.affected ? result.affected > 0 : false
    }

    async deactivatePlan(id: string): Promise<boolean> {
        const result = await this.planRepository.update(id, { isActive: false })
        return result.affected ? result.affected > 0 : false
    }

    async deletePlan(id: string): Promise<boolean> {
        const result = await this.planRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}