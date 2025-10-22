import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('gym_class_categories')
export class GymClassCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    classId: string;

    @Column('uuid')
    categoryId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
