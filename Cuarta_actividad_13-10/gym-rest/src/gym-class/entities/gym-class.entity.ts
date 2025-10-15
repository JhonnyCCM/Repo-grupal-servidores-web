import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DifficultyLevel } from '../../common/enums';
import type { ICategory, IRoom, IScheduleItem } from '../../common/enums';
import { Coach } from '../../coach/entities/coach.entity';

@Entity('gym_classes')
export class GymClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json' })
  category: ICategory;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Column({ type: 'json' })
  room: IRoom;

  @Column({ name: 'difficulty_level', type: 'varchar', length: 50 })
  difficultyLevel: DifficultyLevel;

  @Column({ type: 'json' })
  schedule: IScheduleItem[];

  @Column({ name: 'image_url', nullable: true, length: 500 })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Coach, (coach) => coach.classes)
  coach: Coach;

  @Column({ name: 'coach_id' })
  coachId: string;
}
