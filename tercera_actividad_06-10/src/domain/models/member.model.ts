import { Entity, Column } from "typeorm"
import { BaseUser } from "./base-user.model"

@Entity()
export class Member extends BaseUser {
    @Column()
    membershipType: string

    @Column()
    membershipStartDate: Date

    @Column()
    membershipEndDate: Date

    @Column({ default: true })
    isActive: boolean

    @Column({ nullable: true })
    lastCheckIn?: Date

    @Column("simple-array", { nullable: true })
    fitnessGoals?: string[]

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    weight?: number

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    height?: number
}