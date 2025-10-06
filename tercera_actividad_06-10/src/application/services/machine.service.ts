import { AppDataSource } from '../../presentation/data-source';
import { MachineModel } from '../../domain/models/machine.model';

export class MachineService {
    private machineRepository = AppDataSource.getRepository(MachineModel);

    async createMachine(machineData: Partial<MachineModel>): Promise<MachineModel> {
        if (!machineData.name) {
            throw new Error('Machine name is required');
        }
        const machine = this.machineRepository.create(machineData);
        return await this.machineRepository.save(machine);
    }

    async updateMachine(id: number, machineData: Partial<MachineModel>): Promise<MachineModel | null> {
        await this.machineRepository.update(id, machineData);
        return this.getMachineById(id);
    }

    async getMachineById(id: number): Promise<MachineModel | null> {
        return await this.machineRepository.findOne({
            where: { id }
        });
    }

    async getAllMachines(): Promise<MachineModel[]> {
        return await this.machineRepository.find();
    }

    async deleteMachine(id: number): Promise<boolean> {
        const result = await this.machineRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
