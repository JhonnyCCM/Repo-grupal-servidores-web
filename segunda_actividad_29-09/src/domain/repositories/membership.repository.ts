import { Membership } from '../entities/membership.entity.js'

export interface MembershipRepository {
  create(membership: Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void
  update(id: string, membership: Partial<Membership>): Promise<Membership | null>
  getById(id: string): Promise<Membership | null>
  getByUserId(userId: string): Promise<Membership[]>
  getActiveMembershipsByUserId(userId: string): Promise<Membership | null>
  getAll(): Promise<Membership[]>
  delete(id: string): Promise<boolean>
}