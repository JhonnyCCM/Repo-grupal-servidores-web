import type { PaymentMethod } from './PaymentMethod.js'

export enum SuscripcionStatus {
  ACTIVA = 'Activa',
  PENDIENTE = 'Pendiente',
  CANCELADA = 'Cancelada',
  EXPIRADA = 'Expirada',
}

export class Suscripcion {
  constructor(
    public id: string,
    public userId: string,
    public planId: string,
    public planName: string | null = null,
    public price: number = 0,
    public recurring: boolean = false,
    public interval: 'monthly' | 'yearly' | string = 'monthly',
    public paymentMethod: PaymentMethod | null = null,
    public status: SuscripcionStatus = SuscripcionStatus.PENDIENTE,
    public startDate: Date = new Date(),
    public endDate: Date | null = null,
    public isActive: boolean = false,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  activate(paymentMethod?: PaymentMethod) {
    if (paymentMethod) this.paymentMethod = paymentMethod
    this.status = SuscripcionStatus.ACTIVA
    this.isActive = true
    this.startDate = new Date()
    // Si es recurrente, establecer endDate según interval (simple heurística)
    if (this.recurring) {
      const end = new Date(this.startDate)
      if (this.interval === 'yearly') end.setFullYear(end.getFullYear() + 1)
      else end.setMonth(end.getMonth() + 1)
      this.endDate = end
    }
    this.updatedAt = new Date()
  }

  cancel() {
    this.status = SuscripcionStatus.CANCELADA
    this.isActive = false
    this.updatedAt = new Date()
  }

  renew() {
    if (!this.recurring) return
    const now = new Date()
    this.startDate = now
    const end = new Date(now)
    if (this.interval === 'yearly') end.setFullYear(end.getFullYear() + 1)
    else end.setMonth(end.getMonth() + 1)
    this.endDate = end
    this.status = SuscripcionStatus.ACTIVA
    this.isActive = true
    this.updatedAt = new Date()
  }
}
