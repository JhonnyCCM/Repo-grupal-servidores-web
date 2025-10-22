import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Status } from "src/common/enums";

@Entity('equipment')
export class Equiptment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 200 })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({
        type: 'varchar',
        default: Status.ACTIVE
    })
    status: Status;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    imageUrl: string;
}
