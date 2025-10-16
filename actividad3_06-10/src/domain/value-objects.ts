export enum DifficultyLevel {
  BEGINNER = 'Principiante',
  INTERMEDIATE = 'Intermedio',
  ADVANCED = 'Avanzado',
}

export enum Status {
  ACTIVE = 'Disponible',
  INACTIVE = 'No disponible',
  MAINTENANCE = 'En mantenimiento',
}

export enum MembershipStatus {
  ACTIVE = 'Activa',
  INACTIVE = 'Inactiva',
  EXPIRED = 'Expirada',
}

export enum PaymentStatus {
  PENDING = 'Pendiente',
  COMPLETED = 'Completado',
  FAILED = 'Fallido',
  REFUNDED = 'Reembolsado',
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
