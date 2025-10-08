import { Payment } from '../../domain/models/payment.model'
import type { PaymentRepository } from '../../domain/repositories/payment.repository'
import { v4 as uuid } from 'uuid'

const payments: Payment[] = []

export class InMemoryPaymentRepository implements PaymentRepository {
  create(payment: Omit<Payment, 'id' | 'paidAt'>, callback: (error: Error | null, result?: string) => void): void {
    setTimeout(() => {
      try {
        const newPayment: Payment = {
          id: uuid(),
          membershipId: payment.membershipId,
          method: payment.method,
          amount: payment.amount,
          transactionId: payment.transactionId,
          status: payment.status,
          membership: {} as any,
          paidAt: new Date()
        }
        payments.push(newPayment)
        callback(null, newPayment.id)
      } catch (error) {
        callback(error as Error)
      }
    }, 500)
  }

  update(id: string, payment: Partial<Payment>): Promise<Payment | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = payments.findIndex((p) => p.id === id)
        if (index === -1) {
          return resolve(null)
        }
        const updatedPayment = { ...payments[index], ...payment } as Payment
        payments[index] = updatedPayment
        resolve(updatedPayment)
      }, 500)
    })
  }

  async getById(id: string): Promise<Payment | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return payments.find((p) => p.id === id) || null
  }

  async getByMembershipId(membershipId: string): Promise<Payment[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return payments.filter((p) => p.membershipId === membershipId)
  }

  async getByTransactionId(transactionId: string): Promise<Payment | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return payments.find((p) => p.transactionId === transactionId) || null
  }

  async getAll(): Promise<Payment[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return payments
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = payments.findIndex((p) => p.id === id)
    if (index === -1) {
      return false
    }
    payments.splice(index, 1)
    return true
  }
}