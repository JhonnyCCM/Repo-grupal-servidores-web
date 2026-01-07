import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('clases')
export class Clase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  horario: string;

  @Column({ type: 'int' })
  cupo: number;

  @Column({ type: 'varchar', length: 255 })
  instructor: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
