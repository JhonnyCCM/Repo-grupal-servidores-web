import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../value-objects";
import { GymClassModel } from "./gym-class.model";

@Entity('coaches')
export class CoachModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    fullName!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    phone!: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.COACH
    })
    role!: Role;

    @Column()
    passwordHash!: string;

    @Column('json')
    specialities!: { id: string; name: string; description: string }[];

    @Column({ default: true })
    isActive!: boolean;

    @Column()
    biography!: string;

    @Column()
    imageUrl!: string;

    @OneToMany(() => GymClassModel, gymClass => gymClass.coach)
    classes!: GymClassModel[];

    @Column({ default: 0 })
    classesTaught!: number;

    @Column({ default: 0 })
    experienceYears!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}