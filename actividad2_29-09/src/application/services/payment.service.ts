import { Payment } from "../../domain/entities/payment.entity.js";
import type { PaymentRepository } from "../../domain/repositories/payment.repository.js";

export class PaymentService {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    createPayment(payment: Omit<Payment, "id" | "paidAt">, callback: (error: Error | null, result?: string) => void): void {
        if (!payment.amount || !payment.membershipId || !payment.transactionId) {
            return callback(new Error("Amount, membership ID, and transaction ID are required"));
        }
        this.paymentRepository.create(payment, callback);
    }
    updatePayment(id: string, payment: Partial<Payment>): Promise<Payment | null> {
        return this.paymentRepository.update(id, payment);
    }
    getPaymentById(id: string): Promise<Payment | null> {
        return this.paymentRepository.getById(id);
    }
    getPaymentsByMembershipId(membershipId: string): Promise<Payment[]> {
        return this.paymentRepository.getByMembershipId(membershipId);
    }
    getPaymentByTransactionId(transactionId: string): Promise<Payment | null> {
        return this.paymentRepository.getByTransactionId(transactionId);
    }
    getAllPayments(): Promise<Payment[]> {
        return this.paymentRepository.getAll();
    }
    deletePayment(id: string): Promise<boolean> {
        return this.paymentRepository.delete(id);
    }
}