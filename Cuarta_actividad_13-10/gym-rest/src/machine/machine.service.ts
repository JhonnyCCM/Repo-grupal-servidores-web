import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Machine } from './entities/machine.entity';
import { Status } from '../common/enums';

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
  ) {}

  async create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const machine = this.machineRepository.create(createMachineDto);
    return await this.machineRepository.save(machine);
  }

  async findAll(): Promise<Machine[]> {
    return await this.machineRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Machine> {
    const machine = await this.machineRepository.findOne({
      where: { id },
    });
    
    if (!machine) {
      throw new NotFoundException(`Máquina con ID ${id} no encontrada`);
    }
    
    return machine;
  }

  async update(id: string, updateMachineDto: UpdateMachineDto): Promise<Machine> {
    const machine = await this.findOne(id);
    
    await this.machineRepository.update(id, updateMachineDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const machine = await this.findOne(id);
    await this.machineRepository.remove(machine);
  }

  async findByStatus(status: Status): Promise<Machine[]> {
    return await this.machineRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: Status): Promise<Machine> {
    await this.findOne(id);
    await this.machineRepository.update(id, { status });
    return await this.findOne(id);
  }
}
