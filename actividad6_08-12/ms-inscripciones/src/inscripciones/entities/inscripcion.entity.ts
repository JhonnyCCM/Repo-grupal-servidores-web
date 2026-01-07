import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('inscripciones')
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'clase_id', type: 'int' })
  claseId: number;

  @Column({ type: 'varchar', length: 255 })
  alumno: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  // Campo crítico para idempotencia - evita duplicados a nivel de BD también
  @Column({ name: 'message_id', type: 'varchar', length: 255, unique: true })
  @Index()
  messageId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
