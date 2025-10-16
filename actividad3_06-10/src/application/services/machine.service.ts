import { AppDataSource } from '../../presentation/data-source'
import { Machine } from '../../domain/models/machine.model'
import { Status } from '../../domain/value-objects'

export class MachineService {
    private machineRepository = AppDataSource.getRepository(Machine)

    async createMachine(machineData: Partial<Machine>): Promise<Machine> {
        if (!machineData.name || !machineData.description) {
            throw new Error('Machine name and description are required')
        }
        const machine = this.machineRepository.create({
            ...machineData,
            status: machineData.status || Status.ACTIVE
        })
        return await this.machineRepository.save(machine)
    }

    async updateMachine(id: string, machineData: Partial<Machine>): Promise<Machine | null> {
        await this.machineRepository.update(id, machineData)
        return this.getMachineById(id)
    }

    async getMachineById(id: string): Promise<Machine | null> {
        return await this.machineRepository.findOne({
            where: { id }
        })
    }

    async getMachinesByStatus(status: Status): Promise<Machine[]> {
        return await this.machineRepository.find({
            where: { status }
        })
    }

    async getAvailableMachines(): Promise<Machine[]> {
        return await this.machineRepository.find({
            where: { status: Status.ACTIVE }
        })
    }

    async getAllMachines(): Promise<Machine[]> {
        return await this.machineRepository.find()
    }

    async deleteMachine(id: string): Promise<boolean> {
        const result = await this.machineRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}
