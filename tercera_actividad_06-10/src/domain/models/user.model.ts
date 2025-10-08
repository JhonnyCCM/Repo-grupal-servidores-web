import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany } from "typeorm"
import { GymClass } from "./gym-class.model"
import { Favorite } from "./favorite.model"

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

  @Column({ nullable: true })
  imageUrl?: string

  @Column({ default: true })
  isActive!: boolean

  @ManyToMany(() => GymClass, (gymClass) => gymClass.enrolledMembers)
  enrolledClasses!: GymClass[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites!: Favorite[];

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
