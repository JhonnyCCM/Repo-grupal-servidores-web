import { Machine } from "../../domain/entities/machine.entity.js";
import type { MachineRepository } from "../../domain/repositories/machine.repository.js";

export class MachineService {
    constructor(private readonly machineRepository: MachineRepository) {}

    createMachine(machine: Omit<Machine, "id">, callback: (error: Error | null, result?: string) => void): void {
        if (!machine.name) {
            return callback(new Error("Machine name is required"));
        }
        this.machineRepository.create(machine, callback);
    }

    updateMachine(id: string, machine: Partial<Machine>): Promise<Machine | null> {
        return this.machineRepository.update(id, machine);
    }

    getMachineById(id: string): Promise<Machine | null> {
        return this.machineRepository.getById(id);
    }

    getAllMachines(): Promise<Machine[]> {
        return this.machineRepository.getAll();
    }

    deleteMachine(id: string): Promise<boolean> {
        return this.machineRepository.delete(id);
    }
}
