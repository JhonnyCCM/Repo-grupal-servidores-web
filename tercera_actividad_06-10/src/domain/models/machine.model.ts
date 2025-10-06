import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Status } from "../value-objects";

@Entity('machines')
export class MachineModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column('json')
    specialities!: { id: string; name: string; description: string }[];

    @Column('json')
    room!: { id: string; name: string; description: string; location: string; capacity: number }[];

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status!: Status;

    @Column()
    imageUrl!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}