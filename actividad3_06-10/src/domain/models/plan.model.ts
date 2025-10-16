import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("plan")
export class Plan {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  name!: string

  @Column({ type: "text" })
  description!: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number

  @Column()
  durationInMonths!: number

  @Column({ type: "simple-array" })
  features!: string[]
  
  @CreateDateColumn()
  createdAt!: Date
  
  @UpdateDateColumn()
  updatedAt!: Date

  @Column({ default: true })
  isActive!: boolean
}
