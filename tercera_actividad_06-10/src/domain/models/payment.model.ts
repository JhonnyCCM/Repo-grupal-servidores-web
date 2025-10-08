import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { PaymentStatus } from "../value-objects"
import { Membership } from "./membership.model"

@Entity("payment")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  membershipId!: string

  @ManyToOne(() => Membership, (membership) => membership.payments)
  @JoinColumn({ name: "membershipId" })
  membership!: Membership

  @Column()
  method!: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number

  @Column()
  transactionId!: string

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus

  @CreateDateColumn()
  paidAt!: Date
}
