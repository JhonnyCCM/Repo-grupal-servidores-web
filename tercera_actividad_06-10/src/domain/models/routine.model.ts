import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { DifficultyLevel } from "../value-objects"

@Entity("routine")
export class Routine {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  name!: string

  @Column({ type: "text" })
  description!: string

  @Column()
  machineId!: string

  @Column({ type: "simple-array" })
  exercises!: string[]

  @Column({ type: "simple-array", nullable: true })
  animationsUrls?: string[]

  @Column({ type: "enum", enum: DifficultyLevel })
  difficulty!: DifficultyLevel

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
