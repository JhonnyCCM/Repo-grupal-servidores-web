import type { PaymentMethod } from './paymentMethod.js'
import type { SuscripcionStatus } from '../value-objects.js'

export class Suscripcion {
  constructor(
    public id: string,
    public userId: string,
    public planId: string,
    public planName: string | null = null,
    public price: number = 0,
    public interval: 'monthly' | 'yearly' | string = 'monthly',
    public paymentMethod: PaymentMethod | null = null,
    public status: SuscripcionStatus,
    public startDate: Date = new Date(),
    public endDate: Date | null = null,
    public isActive: boolean = false,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
