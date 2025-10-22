import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { UpdateGymClassDto } from './dto/update-gym-class.dto';
import { GymClass } from './entities/gym-class.entity';
import { DifficultyLevel } from 'src/common/enums';

@Injectable()
export class GymClassService {
  constructor(
    @InjectRepository(GymClass)
    private readonly gymClassRepository: Repository<GymClass>,
  ) {}

  async create(createGymClassDto: CreateGymClassDto): Promise<GymClass> {
    try {
      const gymClass = this.gymClassRepository.create(createGymClassDto);
      return await this.gymClassRepository.save(gymClass);
    } catch (error) {
      throw new BadRequestException('Error al crear la clase de gimnasio');
    }
  }

  async findAll(): Promise<GymClass[]> {
    try {
      return await this.gymClassRepository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener las clases de gimnasio');
    }
  }

  async findOne(id: string): Promise<GymClass> {
    try {
      const gymClass = await this.gymClassRepository.findOne({
        where: { id }
      });

      if (!gymClass) {
        throw new NotFoundException(`Clase de gimnasio con ID ${id} no encontrada`);
      }

      return gymClass;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener la clase de gimnasio');
    }
  }

  async findActive(): Promise<GymClass[]> {
    try {
      return await this.gymClassRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener las clases activas');
    }
  }

  async findByCoach(coachId: string): Promise<GymClass[]> {
    try {
      return await this.gymClassRepository.find({
        where: { coachId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener las clases del entrenador');
    }
  }

  async findByDifficulty(difficultyLevel: DifficultyLevel): Promise<GymClass[]> {
    try {
      return await this.gymClassRepository.find({
        where: { difficultyLevel },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener las clases por dificultad');
    }
  }

  async findByRoom(roomId: string): Promise<GymClass[]> {
    try {
      return await this.gymClassRepository.find({
        where: { roomId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener las clases del salón');
    }
  }

  async searchByName(name: string): Promise<GymClass[]> {
    try {
      return await this.gymClassRepository
        .createQueryBuilder('gymClass')
        .where('gymClass.name ILIKE :name', { name: `%${name}%` })
        .orderBy('gymClass.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new BadRequestException('Error al buscar clases por nombre');
    }
  }

  async update(id: string, updateGymClassDto: UpdateGymClassDto): Promise<GymClass> {
    try {
      const gymClass = await this.findOne(id);
      Object.assign(gymClass, updateGymClassDto);
      return await this.gymClassRepository.save(gymClass);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar la clase de gimnasio');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const gymClass = await this.findOne(id);
      await this.gymClassRepository.remove(gymClass);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la clase de gimnasio');
    }
  }

  async softDelete(id: string): Promise<GymClass> {
    try {
      const gymClass = await this.findOne(id);
      gymClass.isActive = false;
      return await this.gymClassRepository.save(gymClass);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al desactivar la clase de gimnasio');
    }
  }

  async activate(id: string): Promise<GymClass> {
    try {
      const gymClass = await this.findOne(id);
      gymClass.isActive = true;
      return await this.gymClassRepository.save(gymClass);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al activar la clase de gimnasio');
    }
  }
}
