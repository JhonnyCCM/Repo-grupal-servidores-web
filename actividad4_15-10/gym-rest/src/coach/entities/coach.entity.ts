import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('coaches')
export class Coach {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    firstName: string;

    @Column({ length: 100 })
    lastName: string;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column('text', { nullable: true })
    biography: string;

    @Column({ type: 'int', default: 0 })
    experienceYears: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    imageUrl: string;

    @Column('simple-array', { nullable: true })
    specialities: string[];
}
