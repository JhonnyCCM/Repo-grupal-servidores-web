import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { MembershipStatus } from "../value-objects"
import { Plan } from "./plan.model"
import { User } from "./user.model"
import { Payment } from "./payment.model"

@Entity("membership")
export class Membership {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  userId!: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User

  @Column()
  planId!: string

  @ManyToOne(() => Plan)
  @JoinColumn({ name: "planId" })
  plan!: Plan

  @Column()
  planName!: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  planPrice!: number

  @OneToMany(() => Payment, (payment) => payment.membership)
  payments!: Payment[]

  @Column({ type: "enum", enum: MembershipStatus, default: MembershipStatus.ACTIVE })
  status!: MembershipStatus

  @Column({ type: "timestamp" })
  startDate!: Date

  @Column({ type: "timestamp", nullable: true })
  endDate?: Date

  @Column({ default: true })
  isActive!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
