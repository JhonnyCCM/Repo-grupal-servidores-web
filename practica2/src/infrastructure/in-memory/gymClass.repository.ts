import { GymClass } from "../../domain/gymClass.js";
import type { GymClassRepository } from "../../domain/gymClass.repository.js";
import { v4 as uuid } from "uuid";

const gymClasses: GymClass[] = [];

export class InMemoryGymClassRepository implements GymClassRepository {
    create(gymClass: Omit<GymClass, "id">, callback: (error: Error | null, result?: string) => void): void {
        setTimeout(() => {
            try {
                const newGymClass = new GymClass(uuid(), gymClass.name, gymClass.description, gymClass.schedule, gymClass.capacity);
                gymClasses.push(newGymClass);
                callback(null, newGymClass.id);
            } catch (error) {
                callback(error as Error);
            }
        }, 500);
    }

    update(id: string, gymClass: Partial<GymClass>): Promise<GymClass | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = gymClasses.findIndex(g => g.id === id);
                if (index === -1) {
                    return resolve(null);
                }
                const updatedGymClass = { ...gymClasses[index], ...gymClass } as GymClass;
                gymClasses[index] = updatedGymClass;
                resolve(updatedGymClass);
            }, 500);
        });
    }

    async getById(id: string): Promise<GymClass | null> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return gymClasses.find(g => g.id === id) || null;
    }

    async getAll(): Promise<GymClass[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return gymClasses;
    }

    async delete(id: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = gymClasses.findIndex(g => g.id === id);
        if (index === -1) {
            return false;
        }
        gymClasses.splice(index, 1);
        return true;
    }
}
