import type { MembershipStatus } from '../value-objects.js'
import { Payment } from './payment.entity.js';

export class Membership {
  constructor(
    public id: string,
    public userId: string,
    public planId: string,
    public planName: string,
    public planPrice: number,
    public payments: Payment[] = [],
    public status: MembershipStatus,
    public startDate: Date = new Date(),
    public endDate: Date,
    public isActive: boolean,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
