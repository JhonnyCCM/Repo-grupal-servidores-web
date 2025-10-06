export interface RoutineStep {
  id: string;
  description: string;
  sets?: number;
  reps?: number;
  machineId?: string;
    durationMinutes?: number;
    restSeconds?: number;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  coachId: string;
  userId: string;
  steps: RoutineStep[];
    createdAt: Date;
    updatedAt: Date;
}