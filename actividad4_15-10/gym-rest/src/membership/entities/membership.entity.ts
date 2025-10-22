import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MembershipStatus } from "src/common/enums";

@Entity('memberships')
export class Membership {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('uuid')
    userId: string;

    @Column('uuid')
    planId: string;

    @Column({
        type: 'varchar',
        default: MembershipStatus.ACTIVE
    })
    status: MembershipStatus;

    @Column('date')
    startDate: Date;

    @Column('date')
    endDate: Date;
}
