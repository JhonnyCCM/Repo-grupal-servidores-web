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

export interface IScheduleItem {
  readonly day: string;
  readonly startTime: string;
  readonly endTime: string;
}

export interface ISpeciality {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface IRoom {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly location: string;
  readonly capacity: number;
}

export interface ICategory {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}