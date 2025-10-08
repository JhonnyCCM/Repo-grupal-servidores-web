import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToOne, OneToMany } from "typeorm"
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

  @Column({ type: "enum", enum: DifficultyLevel, default: DifficultyLevel.BEGINNER })
  difficultyLevel!: DifficultyLevel

  @Column({ type: "simple-array" })
  schedule!: string[]

  @Column({ type: "simple-array" })
  room!: string[]

  @Column({ nullable: true })
  imageUrl?: string

  @Column({ default: true })
  isActive!: boolean

  @ManyToMany(() => User, (user) => user.enrolledClasses)
  @JoinTable({
    name: "class_enrollments",
    joinColumn: { name: "classId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  enrolledMembers!: User[]

  // @ManyToMany(() => User, (user) => user.favorites)
  // @JoinTable({
  //   name: "user_favorite_classes",
  //   joinColumn: {
  //     name: "gymClassId",
  //     referencedColumnName: "id"
  //   },
  //   inverseJoinColumn: {
  //     name: "userId",
  //     referencedColumnName: "id"
  //   }
  // })
  // favoritedByUsers!: User[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}