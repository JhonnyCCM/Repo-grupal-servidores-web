import { GymClass } from "../domain/gymClass.js";
import type { GymClassRepository } from "../domain/gymClass.repository.js";

export class GymClassService {
    constructor(private readonly gymClassRepository: GymClassRepository) {}

    createGymClass(gymClass: Omit<GymClass, "id">, callback: (error: Error | null, result?: string) => void): void {
        if (!gymClass.name) {
            return callback(new Error("Class name is required"));
        }
        this.gymClassRepository.create(gymClass, callback);
    }

    updateGymClass(id: string, gymClass: Partial<GymClass>): Promise<GymClass | null> {
        return this.gymClassRepository.update(id, gymClass);
    }

    getGymClassById(id: string): Promise<GymClass | null> {
        return this.gymClassRepository.getById(id);
    }

    getAllGymClasses(): Promise<GymClass[]> {
        return this.gymClassRepository.getAll();
    }

    deleteGymClass(id: string): Promise<boolean> {
        return this.gymClassRepository.delete(id);
    }
}
