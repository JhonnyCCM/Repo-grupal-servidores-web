import type { PaymentMethod } from './PaymentMethod.js'

export type CompraItem = {
  readonly productId: string | number
  readonly name?: string
  readonly quantity: number
  readonly unitPrice: number
}

export enum CompraStatus {
  PENDIENTE = 'Pendiente',
  PAGADO = 'Pagado',
  CANCELADO = 'Cancelado',
  REEMBOLSADO = 'Reembolsado',
}

export class Compra {
  constructor(
    public id: string,
    public buyerId: string,
    public items: CompraItem[],
    public total: number | null = null,
    public paymentMethod: PaymentMethod | null = null,
    public status: CompraStatus = CompraStatus.PENDIENTE,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    // Validaciones
    if (!Array.isArray(this.items) || this.items.length === 0) {
      throw new Error('La compra debe tener al menos un item')
    }

    for (const it of this.items) {
      if (!it.productId) throw new Error('Cada item debe tener productId')
      if (!Number.isFinite(it.quantity) || it.quantity <= 0)
        throw new Error('La cantidad de cada item debe ser mayor que 0')
      if (!Number.isFinite(it.unitPrice) || it.unitPrice < 0)
        throw new Error('El precio unitario debe ser >= 0')
    }

    if (this.total === null) {
      this.total = this.calculateTotal()
    }

    // Redondear a 2 decimales
    this.total = Math.round((this.total as number) * 100) / 100
  }

  // Calcula el total sumando quantity * unitPrice de cada item
  calculateTotal(): number {
    const raw = this.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0)
    // devolver con 2 decimales
    return Math.round(raw * 100) / 100
  }

  // Marcar como pagada
  markAsPaid(paymentMethod: PaymentMethod) {
    this.paymentMethod = paymentMethod
    this.status = CompraStatus.PAGADO
    this.updatedAt = new Date()
  }

  // Cancelar la compra
  cancel() {
    this.status = CompraStatus.CANCELADO
    this.updatedAt = new Date()
  }
}
