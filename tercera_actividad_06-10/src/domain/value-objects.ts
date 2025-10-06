export enum DifficultyLevel {
  BEGINNER = 'Principiante',
  INTERMEDIATE = 'Intermedio',
  ADVANCED = 'Avanzado',
}

export enum Role {
  ADMIN = 'Administrador',
  MEMBER = 'Miembro',
  COACH = 'Entrenador',
}

export enum Status {
  ACTIVE = 'Disponible',
  INACTIVE = 'No disponible',
  MAINTENANCE = 'En mantenimiento',
}

export interface IScheduleItem {
  readonly day: string
  readonly startTime: string
  readonly endTime: string
}

export interface ISpeciality {
  readonly id: string
  readonly name: string
  readonly description: string
}

export interface IRoom {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly location: string
  readonly capacity: number
}

export interface ICategory {
  readonly id: string
  readonly name: string
  readonly description: string
}

export type CompraItem = {
  readonly productId: string | number
  readonly name?: string
  readonly quantity: number
  readonly unitPrice: number
}

export enum SuscripcionStatus {
  ACTIVA = 'Activa',
  PENDIENTE = 'Pendiente',
  CANCELADA = 'Cancelada',
  EXPIRADA = 'Expirada',
}

export enum CompraStatus {
  PENDIENTE = 'Pendiente',
  PAGADO = 'Pagado',
  CANCELADO = 'Cancelado',
  REEMBOLSADO = 'Reembolsado',
}