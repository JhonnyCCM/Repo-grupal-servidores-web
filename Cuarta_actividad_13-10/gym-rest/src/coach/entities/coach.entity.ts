import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { ISpeciality } from '../../common/enums';
import { GymClass } from '../../gym-class/entities/gym-class.entity';

@Entity('coaches')
export class Coach {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 10 })
  gender: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ type: 'json' })
  specialities: ISpeciality[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'text' })
  biography: string;

  @Column({ name: 'experience_years', type: 'integer' })
  experienceYears: number;

  @Column({ name: 'image_url', nullable: true, length: 500 })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => GymClass, (gymClass) => gymClass.coach)
  classes: GymClass[];
}
