import { AppDataSource } from '../../presentation/data-source'
import { Payment } from '../../domain/models/payment.model'
import { PaymentStatus } from '../../domain/value-objects'

export class PaymentService {
    private paymentRepository = AppDataSource.getRepository(Payment)

    async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
        if (!paymentData.membershipId || !paymentData.amount || !paymentData.transactionId) {
            throw new Error('Membership ID, amount, and transaction ID are required')
        }

        if (paymentData.amount <= 0) {
            throw new Error('Amount must be greater than 0')
        }

        const existingPayment = await this.getPaymentByTransactionId(paymentData.transactionId)
        if (existingPayment) {
            throw new Error('Transaction ID already exists')
        }

        const payment = this.paymentRepository.create({
            ...paymentData,
            status: paymentData.status || PaymentStatus.PENDING
        })
        return await this.paymentRepository.save(payment)
    }

    async updatePayment(id: string, paymentData: Partial<Payment>): Promise<Payment | null> {
        await this.paymentRepository.update(id, paymentData)
        return this.getPaymentById(id)
    }

    async getPaymentById(id: string): Promise<Payment | null> {
        return await this.paymentRepository.findOne({
            where: { id }
        })
    }

    async getPaymentByTransactionId(transactionId: string): Promise<Payment | null> {
        return await this.paymentRepository.findOne({
            where: { transactionId }
        })
    }

    async getPaymentsByMembershipId(membershipId: string): Promise<Payment[]> {
        return await this.paymentRepository.find({
            where: { membershipId },
            order: { paidAt: 'DESC' }
        })
    }

    async getPaymentsByStatus(status: PaymentStatus): Promise<Payment[]> {
        return await this.paymentRepository.find({
            where: { status },
            order: { paidAt: 'DESC' }
        })
    }

    async getPendingPayments(): Promise<Payment[]> {
        return await this.getPaymentsByStatus(PaymentStatus.PENDING)
    }

    async getCompletedPayments(): Promise<Payment[]> {
        return await this.getPaymentsByStatus(PaymentStatus.COMPLETED)
    }

    async getFailedPayments(): Promise<Payment[]> {
        return await this.getPaymentsByStatus(PaymentStatus.FAILED)
    }

    async getAllPayments(): Promise<Payment[]> {
        return await this.paymentRepository.find({
            order: { paidAt: 'DESC' }
        })
    }

    async completePayment(id: string): Promise<boolean> {
        const result = await this.paymentRepository.update(id, {
            status: PaymentStatus.COMPLETED
        })
        return result.affected ? result.affected > 0 : false
    }

    async failPayment(id: string): Promise<boolean> {
        const result = await this.paymentRepository.update(id, {
            status: PaymentStatus.FAILED
        })
        return result.affected ? result.affected > 0 : false
    }

    async refundPayment(id: string): Promise<boolean> {
        const payment = await this.getPaymentById(id)
        if (!payment) {
            throw new Error('Payment not found')
        }

        if (payment.status !== PaymentStatus.COMPLETED) {
            throw new Error('Only completed payments can be refunded')
        }

        const result = await this.paymentRepository.update(id, {
            status: PaymentStatus.REFUNDED
        })
        return result.affected ? result.affected > 0 : false
    }

    async getPaymentsByMethod(method: string): Promise<Payment[]> {
        return await this.paymentRepository.find({
            where: { method },
            order: { paidAt: 'DESC' }
        })
    }

    async getTotalRevenue(): Promise<number> {
        const result = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'total')
            .where('payment.status = :status')
            .setParameter('status', PaymentStatus.COMPLETED)
            .getRawOne()

        return parseFloat(result.total) || 0
    }

    async deletePayment(id: string): Promise<boolean> {
        const result = await this.paymentRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}