import { Payment } from '../models/payment.model'

export interface PaymentRepository {
  create(payment: Omit<Payment, 'id' | 'paidAt'>, callback: (error: Error | null, result?: string) => void): void
  update(id: string, payment: Partial<Payment>): Promise<Payment | null>
  getById(id: string): Promise<Payment | null>
  getByMembershipId(membershipId: string): Promise<Payment[]>
  getByTransactionId(transactionId: string): Promise<Payment | null>
  getAll(): Promise<Payment[]>
  delete(id: string): Promise<boolean>
}