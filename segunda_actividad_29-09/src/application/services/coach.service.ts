import { Coach } from "../../domain/entities/coach.entity.js";
import type { CoachRepository } from "../../domain/repositories/coach.repository.js";

export class CoachService {
    constructor(private readonly coachRepository: CoachRepository) {}

    createCoach(coach: Omit<Coach, "id">, callback: (error: Error | null, result?: string) => void): void {
        if (!coach.fullName || !coach.email) {
            return callback(new Error("Full name and email are required"));
        }
        this.coachRepository.create(coach, callback);
    }

    updateCoach(id: string, coach: Partial<Coach>): Promise<Coach | null> {
        return this.coachRepository.update(id, coach);
    }

    getCoachById(id: string): Promise<Coach | null> {
        return this.coachRepository.getById(id);
    }

    getAllCoaches(): Promise<Coach[]> {
        return this.coachRepository.getAll();
    }

    deleteCoach(id: string): Promise<boolean> {
        return this.coachRepository.delete(id);
    }
}
