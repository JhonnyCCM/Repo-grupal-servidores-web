import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CoachModel } from "./coach.model";
import { DifficultyLevel } from "../value-objects";

@Entity('gym_classes')
export class GymClassModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column()
    schedule!: string;

    @Column()
    capacity!: number;

    @Column({
        type: 'enum',
        enum: DifficultyLevel,
        default: DifficultyLevel.BEGINNER
    })
    difficultyLevel!: DifficultyLevel;

    @ManyToOne(() => CoachModel, coach => coach.classes)
    coach!: CoachModel;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}