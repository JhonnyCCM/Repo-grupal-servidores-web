import { Membership } from '../../domain/entities/membership.entity.js'
import type { MembershipRepository } from '../../domain/repositories/membership.repository.js'
import { v4 as uuid } from 'uuid'

const memberships: Membership[] = []

export class InMemoryMembershipRepository implements MembershipRepository {
  create(membership: Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>, callback: (error: Error | null, result?: string) => void): void {
    setTimeout(() => {
      try {
        const newMembership: Membership = {
          id: uuid(),
          userId: membership.userId,
          planId: membership.planId,
          planName: membership.planName,
          planPrice: membership.planPrice,
          status: membership.status,
          startDate: membership.startDate,
          endDate: membership.endDate,
          isActive: membership.isActive ?? true,
          payments: membership.payments ?? [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        memberships.push(newMembership)
        callback(null, newMembership.id)
      } catch (error) {
        callback(error as Error)
      }
    }, 500)
  }

  update(id: string, membership: Partial<Membership>): Promise<Membership | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = memberships.findIndex((m) => m.id === id)
        if (index === -1) {
          return resolve(null)
        }
        const updatedMembership = { ...memberships[index], ...membership, updatedAt: new Date() } as Membership
        memberships[index] = updatedMembership
        resolve(updatedMembership)
      }, 500)
    })
  }

  async getById(id: string): Promise<Membership | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return memberships.find((m) => m.id === id) || null
  }

  async getByUserId(userId: string): Promise<Membership[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return memberships.filter((m) => m.userId === userId)
  }

  async getActiveMembershipsByUserId(userId: string): Promise<Membership | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return memberships.find((m) => m.userId === userId && m.isActive) || null
  }

  async getAll(): Promise<Membership[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return memberships
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = memberships.findIndex((m) => m.id === id)
    if (index === -1) {
      return false
    }
    memberships.splice(index, 1)
    return true
  }
}