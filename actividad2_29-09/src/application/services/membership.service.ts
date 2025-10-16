import { Membership } from "../../domain/entities/membership.entity.js";
import type { MembershipRepository } from "../../domain/repositories/membership.repository.js";

export class MembershipService {
    constructor(private readonly membershipRepository: MembershipRepository) {}
    createMembership(membership: Omit<Membership, "id" | "createdAt" | "updatedAt">, callback: (error: Error | null, result?: string) => void): void {
        if (!membership.startDate || !membership.endDate || !membership.userId) {
            return callback(new Error("Start date, end date, and user ID are required"));
        }
        this.membershipRepository.create(membership, callback);
    }
    updateMembership(id: string, membership: Partial<Membership>): Promise<Membership | null> {
        return this.membershipRepository.update(id, membership);
    }
    getMembershipById(id: string): Promise<Membership | null> {
        return this.membershipRepository.getById(id);
    }
    getMembershipsByUserId(userId: string): Promise<Membership[]> {
        return this.membershipRepository.getByUserId(userId);
    }
    getActiveMembershipByUserId(userId: string): Promise<Membership | null> {
        return this.membershipRepository.getActiveMembershipsByUserId(userId);
    }
    getAllMemberships(): Promise<Membership[]> {
        return this.membershipRepository.getAll();
    }
    deleteMembership(id: string): Promise<boolean> {
        return this.membershipRepository.delete(id);
    }
}