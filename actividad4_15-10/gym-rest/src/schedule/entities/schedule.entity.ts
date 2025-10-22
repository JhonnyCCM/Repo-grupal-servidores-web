import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('schedules')
export class Schedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 200 })
    name: string;

    @Column('time')
    startTime: Date;

    @Column('time')
    endTime: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}