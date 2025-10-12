import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm"
import { GymClass } from "./gym-class.model"

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  fullName!: string

  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Column()
  phone!: string

  @Column()
  gender!: string

  @Column({ type: "date" })
  birthDate!: Date

  @Column()
  membershipType!: string
  
  @CreateDateColumn()
  createdAt!: Date

  @Column({ default: true })
  isActive!: boolean
  
  @ManyToMany(() => GymClass, (gymClass) => gymClass.enrolledMembers)
  enrolledClasses!: GymClass[];
  
  @UpdateDateColumn()
  updatedAt!: Date

  @Column({ nullable: true })
  imageUrl?: string
}
