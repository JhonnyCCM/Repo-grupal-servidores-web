import { AppDataSource } from '../../presentation/data-source'
import { Membership } from '../../domain/models/membership.model'
import { MembershipStatus } from '../../domain/value-objects'
import { PlanService } from './plan.service'

export class MembershipService {
    private membershipRepository = AppDataSource.getRepository(Membership)
    private planService = new PlanService()

    async createMembership(membershipData: Partial<Membership>): Promise<Membership> {
        if (!membershipData.userId || !membershipData.planId) {
            throw new Error('User ID and Plan ID are required')
        }

        const plan = await this.planService.getPlanById(membershipData.planId)
        if (!plan) {
            throw new Error('Plan not found')
        }

        const existingMembership = await this.getActiveMembershipByUserId(membershipData.userId)
        if (existingMembership) {
            throw new Error('User already has an active membership')
        }

        // Calculate end date based on plan duration
        const startDate = membershipData.startDate || new Date()
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + plan.durationInMonths)

        const membership = this.membershipRepository.create({
            ...membershipData,
            planName: plan.name,
            planPrice: plan.price,
            startDate,
            endDate,
            status: membershipData.status || MembershipStatus.ACTIVE
        })
        return await this.membershipRepository.save(membership)
    }

    async updateMembership(id: string, membershipData: Partial<Membership>): Promise<Membership | null> {
        await this.membershipRepository.update(id, membershipData)
        return this.getMembershipById(id)
    }

    async getMembershipById(id: string): Promise<Membership | null> {
        return await this.membershipRepository.findOne({
            where: { id }
        })
    }

    async getMembershipsByUserId(userId: string): Promise<Membership[]> {
        return await this.membershipRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        })
    }

    async getActiveMembershipByUserId(userId: string): Promise<Membership | null> {
        return await this.membershipRepository.findOne({
            where: { 
                userId, 
                isActive: true,
                status: MembershipStatus.ACTIVE
            }
        })
    }

    async getAllMemberships(): Promise<Membership[]> {
        return await this.membershipRepository.find({
            order: { createdAt: 'DESC' }
        })
    }

    async getActiveMemberships(): Promise<Membership[]> {
        return await this.membershipRepository.find({
            where: { 
                isActive: true,
                status: MembershipStatus.ACTIVE
            }
        })
    }

    async getExpiredMemberships(): Promise<Membership[]> {
        const now = new Date()
        return await this.membershipRepository
            .createQueryBuilder('membership')
            .where('membership.endDate < :now')
            .setParameter('now', now)
            .getMany()
    }

    async renewMembership(membershipId: string, newPlanId?: string): Promise<Membership> {
        const membership = await this.getMembershipById(membershipId)
        if (!membership) {
            throw new Error('Membership not found')
        }

        const planId = newPlanId || membership.planId
        const plan = await this.planService.getPlanById(planId)
        if (!plan) {
            throw new Error('Plan not found')
        }

        // Extend the membership
        const newEndDate = new Date(membership.endDate || new Date())
        newEndDate.setMonth(newEndDate.getMonth() + plan.durationInMonths)

        await this.membershipRepository.update(membershipId, {
            endDate: newEndDate,
            planId: planId,
            planName: plan.name,
            planPrice: plan.price,
            status: MembershipStatus.ACTIVE,
            isActive: true
        })

        return this.getMembershipById(membershipId) as Promise<Membership>
    }

    async cancelMembership(id: string): Promise<boolean> {
        const result = await this.membershipRepository.update(id, {
            status: MembershipStatus.INACTIVE,
            isActive: false
        })
        return result.affected ? result.affected > 0 : false
    }

    async expireMembership(id: string): Promise<boolean> {
        const result = await this.membershipRepository.update(id, {
            status: MembershipStatus.EXPIRED,
            isActive: false
        })
        return result.affected ? result.affected > 0 : false
    }

    async deleteMembership(id: string): Promise<boolean> {
        const result = await this.membershipRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}