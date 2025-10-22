import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('equipment_categories')
export class EquiptmentCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    equiptmentId: string;

    @Column('uuid')
    categoryId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
