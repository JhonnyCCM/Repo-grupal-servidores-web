import { Machine } from "../../domain/machine.js";
import type { MachineRepository } from "../../domain/machine.repository.js";
import { v4 as uuid } from "uuid";

const machines: Machine[] = [];

export class InMemoryMachineRepository implements MachineRepository {
    create(machine: Omit<Machine, "id">, callback: (error: Error | null, result?: string) => void): void {
        setTimeout(() => {
            try {
                const newMachine = new Machine(uuid(), machine.name, machine.description, machine.brand, machine.isAvailable);
                machines.push(newMachine);
                callback(null, newMachine.id);
            } catch (error) {
                callback(error as Error);
            }
        }, 500);
    }

    update(id: string, machine: Partial<Machine>): Promise<Machine | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = machines.findIndex(m => m.id === id);
                if (index === -1) {
                    return resolve(null);
                }
                const updatedMachine = { ...machines[index], ...machine } as Machine;
                machines[index] = updatedMachine;
                resolve(updatedMachine);
            }, 500);
        });
    }

    async getById(id: string): Promise<Machine | null> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return machines.find(m => m.id === id) || null;
    }

    async getAll(): Promise<Machine[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return machines;
    }

    async delete(id: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = machines.findIndex(m => m.id === id);
        if (index === -1) {
            return false;
        }
        machines.splice(index, 1);
        return true;
    }
}
