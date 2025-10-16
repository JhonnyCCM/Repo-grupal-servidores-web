import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
      const coach = this.coachRepository.create({
        ...createCoachDto,
        birthDate: new Date(createCoachDto.birthDate),
      });
      return await this.coachRepository.save(coach);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }

  async findAll(): Promise<Coach[]> {
    return await this.coachRepository.find({
      relations: ['classes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Coach> {
    const coach = await this.coachRepository.findOne({
      where: { id },
      relations: ['classes'],
    });
    
    if (!coach) {
      throw new NotFoundException(`Entrenador con ID ${id} no encontrado`);
    }
    
    return coach;
  }

  async update(id: string, updateCoachDto: UpdateCoachDto): Promise<Coach> {
    const coach = await this.findOne(id);
    
    try {
      const updateData: any = { ...updateCoachDto };
      if (updateCoachDto.birthDate) {
        updateData.birthDate = new Date(updateCoachDto.birthDate);
      }
      
      await this.coachRepository.update(id, updateData);
      return await this.findOne(id);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const coach = await this.findOne(id);
    await this.coachRepository.remove(coach);
  }

  async findByEmail(email: string): Promise<Coach | null> {
    return await this.coachRepository.findOne({
      where: { email },
    });
  }
}
