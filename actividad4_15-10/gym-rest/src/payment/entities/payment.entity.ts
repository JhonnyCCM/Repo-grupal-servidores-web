import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PaymentMethod, PaymentStatus } from "src/common/enums";

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar'
    })
    method: PaymentMethod;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    transactionId?: string;

    @Column({
        type: 'varchar',
        default: PaymentStatus.PENDING
    })
    status: PaymentStatus;

    @Column({ nullable: true })
    paidAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('uuid')
    membershipId: string;

    @Column('uuid')
    userId: string;
}
