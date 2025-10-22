import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquiptmentDto } from './dto/create-equiptment.dto';
import { UpdateEquiptmentDto } from './dto/update-equiptment.dto';
import { Equiptment } from './entities/equiptment.entity';
import { Status } from 'src/common/enums';

@Injectable()
export class EquiptmentService {
  constructor(
    @InjectRepository(Equiptment)
    private readonly equipmentRepository: Repository<Equiptment>,
  ) {}

  async create(createEquiptmentDto: CreateEquiptmentDto): Promise<Equiptment> {
    try {
      const equipment = this.equipmentRepository.create(createEquiptmentDto);
      return await this.equipmentRepository.save(equipment);
    } catch (error) {
      throw new BadRequestException('Error al crear el equipo');
    }
  }

  async findAll(): Promise<Equiptment[]> {
    try {
      return await this.equipmentRepository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los equipos');
    }
  }

  async findOne(id: string): Promise<Equiptment> {
    try {
      const equipment = await this.equipmentRepository.findOne({
        where: { id }
      });

      if (!equipment) {
        throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
      }

      return equipment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el equipo');
    }
  }

  async findByStatus(status: Status): Promise<Equiptment[]> {
    try {
      return await this.equipmentRepository.find({
        where: { status },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los equipos por estado');
    }
  }

  async findActive(): Promise<Equiptment[]> {
    return this.findByStatus(Status.ACTIVE);
  }

  async findInMaintenance(): Promise<Equiptment[]> {
    return this.findByStatus(Status.MAINTENANCE);
  }

  async searchByName(name: string): Promise<Equiptment[]> {
    try {
      return await this.equipmentRepository
        .createQueryBuilder('equipment')
        .where('equipment.name ILIKE :name', { name: `%${name}%` })
        .orderBy('equipment.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new BadRequestException('Error al buscar equipos por nombre');
    }
  }

  async update(id: string, updateEquiptmentDto: UpdateEquiptmentDto): Promise<Equiptment> {
    try {
      const equipment = await this.findOne(id);
      Object.assign(equipment, updateEquiptmentDto);
      return await this.equipmentRepository.save(equipment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el equipo');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const equipment = await this.findOne(id);
      await this.equipmentRepository.remove(equipment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el equipo');
    }
  }

  async setMaintenance(id: string): Promise<Equiptment> {
    try {
      const equipment = await this.findOne(id);
      equipment.status = Status.MAINTENANCE;
      return await this.equipmentRepository.save(equipment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al marcar el equipo en mantenimiento');
    }
  }

  async setActive(id: string): Promise<Equiptment> {
    try {
      const equipment = await this.findOne(id);
      equipment.status = Status.ACTIVE;
      return await this.equipmentRepository.save(equipment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al activar el equipo');
    }
  }
}
