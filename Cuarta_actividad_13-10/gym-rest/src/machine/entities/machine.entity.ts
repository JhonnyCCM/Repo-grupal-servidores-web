import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Status } from '../../common/enums';
import type { IRoom, ISpeciality } from '../../common/enums';

@Entity('machines')
export class Machine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json' })
  specialities: ISpeciality[];

  @Column({ type: 'json' })
  room: IRoom[];

  @Column({ type: 'varchar', length: 50, default: Status.ACTIVE })
  status: Status;

  @Column({ name: 'image_url', nullable: true, length: 500 })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
