import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DifficultyLevel } from "src/common/enums";

@Entity('gym_classes')
export class GymClass {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ length: 200 })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('uuid')
    coachId: string;

    @Column({
        type: 'varchar',
        default: DifficultyLevel.BEGINNER
    })
    difficultyLevel: DifficultyLevel;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    imageUrl: string;

    @Column('uuid', { nullable: true })
    scheduleId: string;

    @Column('uuid', { nullable: true })
    roomId: string;
}
