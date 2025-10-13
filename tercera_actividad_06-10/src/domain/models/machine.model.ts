import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Status } from "../value-objects"

@Entity("machine")
export class Machine {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  name!: string

  @Column({ type: "text" })
  description!: string

  @Column({ type: "simple-array" })
  specialities!: string[]

  @CreateDateColumn()
  createdAt!: Date

  @Column({ type: "simple-array" })
  room!: string[]

  @Column({ type: "enum", enum: Status, default: Status.ACTIVE })
  status!: Status

  @Column({ nullable: true })
  imageUrl?: string

  @UpdateDateColumn()
  updatedAt!: Date
}