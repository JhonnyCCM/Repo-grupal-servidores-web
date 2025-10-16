import { PaymentStatus } from '../value-objects.js'

export class Payment {
  constructor(
    public id: string,
    public membershipId: string,
    public method: string,
    public amount: number,
    public transactionId: string,
    public status: PaymentStatus,
    public paidAt: Date = new Date()
  ) {}
}
