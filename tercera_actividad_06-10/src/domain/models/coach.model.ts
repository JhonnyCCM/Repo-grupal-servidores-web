import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { GymClass } from "./gym-class.model"

@Entity("coach")
export class Coach {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  fullName!: string

  @Column({ unique: true })
  email!: string

  @Column()
  phone!: string

  @Column()
  password!: string
  
  @Column()
  gender!: string

  @Column({ type: "date" })
  birthDate!: Date
  
  @CreateDateColumn()
  createdAt!: Date

  @Column({ type: "simple-array" })
  specialities!: string[]
  
  @Column({ default: true })
  isActive!: boolean
  
  @Column({ type: "text", nullable: true })
  biography?: string
  
  @Column({ default: 0 })
  experienceYears!: number
  
  @Column({ nullable: true })
  imageUrl?: string
  
  @OneToMany(() => GymClass, (gymClass) => gymClass.coach)
  classes!: GymClass[]

  @UpdateDateColumn()
  updatedAt!: Date

}