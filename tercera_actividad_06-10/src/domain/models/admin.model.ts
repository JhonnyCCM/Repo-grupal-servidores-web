import { Entity, Column } from "typeorm"
import { BaseUser } from "./base-user.model"

@Entity()
export class Admin extends BaseUser {
    @Column()
    department: string

    @Column()
    accessLevel: number

    @Column({ type: "simple-array" })
    permissions: string[]

    @Column({ default: true })
    isActive: boolean

    @Column({ nullable: true })
    lastLogin?: Date

    @Column({ nullable: true })
    emergencyContact?: string
}