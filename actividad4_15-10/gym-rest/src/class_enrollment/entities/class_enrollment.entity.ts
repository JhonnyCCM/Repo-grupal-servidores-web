import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('class_enrollments')
export class ClassEnrollment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('date')
    enrollmentDate: Date;

    @Column('uuid')
    userId: string;

    @Column('uuid')
    classId: string;
}
