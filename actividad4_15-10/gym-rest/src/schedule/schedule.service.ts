import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    try {
      // Validar que la hora de inicio sea menor que la hora de fin
      if (createScheduleDto.startTime >= createScheduleDto.endTime) {
        throw new BadRequestException('La hora de inicio debe ser menor que la hora de fin');
      }

      const schedule = this.scheduleRepository.create(createScheduleDto);
      return await this.scheduleRepository.save(schedule);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el horario');
    }
  }

  async findAll(search?: string): Promise<Schedule[]> {
    try {
      const queryBuilder = this.scheduleRepository.createQueryBuilder('schedule');

      if (search) {
        queryBuilder.where('schedule.name LIKE :search', { search: `%${search}%` });
      }

      queryBuilder.orderBy('schedule.startTime', 'ASC');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException('Error al obtener los horarios');
    }
  }

  async findOne(id: string): Promise<Schedule> {
    try {
      const schedule = await this.scheduleRepository.findOne({ where: { id } });
      
      if (!schedule) {
        throw new NotFoundException(`Horario con ID ${id} no encontrado`);
      }

      return schedule;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el horario');
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    try {
      const schedule = await this.findOne(id);

      // Validar que la hora de inicio sea menor que la hora de fin si ambas están presentes
      if (updateScheduleDto.startTime && updateScheduleDto.endTime) {
        if (updateScheduleDto.startTime >= updateScheduleDto.endTime) {
          throw new BadRequestException('La hora de inicio debe ser menor que la hora de fin');
        }
      }

      Object.assign(schedule, updateScheduleDto);
      return await this.scheduleRepository.save(schedule);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el horario');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const schedule = await this.findOne(id);
      await this.scheduleRepository.remove(schedule);
      return { message: `Horario con ID ${id} eliminado correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el horario');
    }
  }

  async findByTimeRange(startTime: string, endTime: string): Promise<Schedule[]> {
    try {
      return await this.scheduleRepository
        .createQueryBuilder('schedule')
        .where('schedule.startTime >= :startTime', { startTime })
        .andWhere('schedule.endTime <= :endTime', { endTime })
        .orderBy('schedule.startTime', 'ASC')
        .getMany();
    } catch (error) {
      throw new BadRequestException('Error al buscar horarios por rango de tiempo');
    }
  }
}
