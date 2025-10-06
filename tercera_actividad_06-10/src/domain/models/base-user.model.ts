import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Role } from "../value-objects"

@Entity()
export class BaseUser {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ length: 100 })
    fullName: string

    @Column({ unique: true })
    email: string

    @Column({ length: 20 })
    phone: string

    @Column({
        type: "enum",
        enum: Role,
        default: Role.MEMBER
    })
    role: Role

    @Column()
    passwordHash: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    constructor(
        fullName: string,
        email: string,
        phone: string,
        role: Role,
        passwordHash: string
    ) {
        this.fullName = fullName
        this.email = email
        this.phone = phone
        this.role = role
        this.passwordHash = passwordHash
    }
}