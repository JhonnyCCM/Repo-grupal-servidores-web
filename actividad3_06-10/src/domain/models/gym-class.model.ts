import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm"
import { Coach } from "./coach.model"
import { DifficultyLevel } from "../value-objects"
import { User } from "./user.model"

@Entity("class")
export class GymClass {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  name!: string

  @Column({ type: "text" })
  description!: string

  @Column()
  coachId!: string

  @ManyToOne(() => Coach, (coach) => coach.classes)
  @JoinColumn({ name: "coachId" })
  coach!: Coach

  @Column({ type: "simple-array" })
  category!: string[]

  @Column()
  capacity!: number
  
  @Column({ default: true })
  isActive!: boolean
  
  @CreateDateColumn()
  createdAt!: Date
  
  @Column({ type: "simple-array" })
  room!: string[]
  
  @Column({ type: "enum", enum: DifficultyLevel, default: DifficultyLevel.BEGINNER })
  difficultyLevel!: DifficultyLevel

  @Column({ type: "simple-array" })
  schedule!: string[]
  
  @Column({ nullable: true })
  imageUrl?: string
  
  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToMany(() => User, (user) => user.enrolledClasses)
  @JoinTable({
    name: "class_enrollments",
    joinColumn: { name: "classId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  enrolledMembers!: User[]
}