import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { Coach } from './entities/coach.entity';

@Injectable()
export class CoachService {
  constructor(
    @InjectRepository(Coach)
    private readonly coachRepository: Repository<Coach>,
  ) {}

  async create(createCoachDto: CreateCoachDto): Promise<Coach> {
    try {
      // Verificar si el email ya existe
      const existingCoach = await this.coachRepository.findOne({
        where: { email: createCoachDto.email }
      });

      if (existingCoach) {
        throw new ConflictException('Ya existe un entrenador con este correo electrónico');
      }

      const coach = this.coachRepository.create(createCoachDto);
      return await this.coachRepository.save(coach);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el entrenador');
    }
  }

  async findAll(): Promise<Coach[]> {
    try {
      return await this.coachRepository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los entrenadores');
    }
  }

  async findOne(id: string): Promise<Coach> {
    try {
      const coach = await this.coachRepository.findOne({
        where: { id }
      });

      if (!coach) {
        throw new NotFoundException(`Entrenador con ID ${id} no encontrado`);
      }

      return coach;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el entrenador');
    }
  }

  async findByEmail(email: string): Promise<Coach> {
    try {
      const coach = await this.coachRepository.findOne({
        where: { email }
      });

      if (!coach) {
        throw new NotFoundException(`Entrenador con email ${email} no encontrado`);
      }

      return coach;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el entrenador');
    }
  }

  async findActive(): Promise<Coach[]> {
    try {
      return await this.coachRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los entrenadores activos');
    }
  }

  async update(id: string, updateCoachDto: UpdateCoachDto): Promise<Coach> {
    try {
      const coach = await this.findOne(id);

      // Si se está actualizando el email, verificar que no esté en uso
      if (updateCoachDto.email && updateCoachDto.email !== coach.email) {
        const existingCoach = await this.coachRepository.findOne({
          where: { email: updateCoachDto.email }
        });

        if (existingCoach) {
          throw new ConflictException('Ya existe un entrenador con este correo electrónico');
        }
      }

      // Si se está actualizando la contraseña, simplemente asignarla
      // En un entorno real se debería hashear, pero para esta práctica la dejamos como texto plano
      if (updateCoachDto.password) {
        // La contraseña se actualiza directamente
      }

      Object.assign(coach, updateCoachDto);
      return await this.coachRepository.save(coach);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el entrenador');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const coach = await this.findOne(id);
      await this.coachRepository.remove(coach);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el entrenador');
    }
  }

  async softDelete(id: string): Promise<Coach> {
    try {
      const coach = await this.findOne(id);
      coach.isActive = false;
      return await this.coachRepository.save(coach);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al desactivar el entrenador');
    }
  }
}
