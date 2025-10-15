import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { UpdateGymClassDto } from './dto/update-gym-class.dto';
import { GymClass } from './entities/gym-class.entity';
import { CoachService } from '../coach/coach.service';
import { DifficultyLevel } from '../common/enums';

@Injectable()
export class GymClassService {
  constructor(
    @InjectRepository(GymClass)
    private readonly gymClassRepository: Repository<GymClass>,
    private readonly coachService: CoachService,
  ) {}

  async create(createGymClassDto: CreateGymClassDto): Promise<GymClass> {
    // Verificar que el entrenador existe
    await this.coachService.findOne(createGymClassDto.coachId);
    
    const gymClass = this.gymClassRepository.create(createGymClassDto);
    return await this.gymClassRepository.save(gymClass);
  }

  async findAll(): Promise<GymClass[]> {
    return await this.gymClassRepository.find({
      relations: ['coach'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<GymClass> {
    const gymClass = await this.gymClassRepository.findOne({
      where: { id },
      relations: ['coach'],
    });
    
    if (!gymClass) {
      throw new NotFoundException(`Clase con ID ${id} no encontrada`);
    }
    
    return gymClass;
  }

  async update(id: string, updateGymClassDto: UpdateGymClassDto): Promise<GymClass> {
    const gymClass = await this.findOne(id);
    
    // Si se actualiza el entrenador, verificar que existe
    if (updateGymClassDto.coachId) {
      await this.coachService.findOne(updateGymClassDto.coachId);
    }
    
    await this.gymClassRepository.update(id, updateGymClassDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const gymClass = await this.findOne(id);
    await this.gymClassRepository.remove(gymClass);
  }

  async findByCoach(coachId: string): Promise<GymClass[]> {
    return await this.gymClassRepository.find({
      where: { coachId },
      relations: ['coach'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDifficultyLevel(difficultyLevel: DifficultyLevel): Promise<GymClass[]> {
    return await this.gymClassRepository.find({
      where: { difficultyLevel },
      relations: ['coach'],
      order: { createdAt: 'DESC' },
    });
  }

  async toggleActiveStatus(id: string): Promise<GymClass> {
    const gymClass = await this.findOne(id);
    await this.gymClassRepository.update(id, { isActive: !gymClass.isActive });
    return await this.findOne(id);
  }

  async findActiveClasses(): Promise<GymClass[]> {
    return await this.gymClassRepository.find({
      where: { isActive: true },
      relations: ['coach'],
      order: { createdAt: 'DESC' },
    });
  }
}
