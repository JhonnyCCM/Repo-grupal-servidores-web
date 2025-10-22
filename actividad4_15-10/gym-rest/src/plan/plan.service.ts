import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    try {
      const plan = this.planRepository.create(createPlanDto);
      return await this.planRepository.save(plan);
    } catch (error) {
      throw new BadRequestException('Error al crear el plan');
    }
  }

  async findAll(): Promise<Plan[]> {
    try {
      return await this.planRepository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los planes');
    }
  }

  async findOne(id: string): Promise<Plan> {
    try {
      const plan = await this.planRepository.findOne({
        where: { id }
      });

      if (!plan) {
        throw new NotFoundException(`Plan con ID ${id} no encontrado`);
      }

      return plan;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el plan');
    }
  }

  async findActive(): Promise<Plan[]> {
    try {
      return await this.planRepository.find({
        where: { isActive: true },
        order: { price: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los planes activos');
    }
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Plan[]> {
    try {
      return await this.planRepository
        .createQueryBuilder('plan')
        .where('plan.price >= :minPrice AND plan.price <= :maxPrice', { minPrice, maxPrice })
        .orderBy('plan.price', 'ASC')
        .getMany();
    } catch (error) {
      throw new BadRequestException('Error al buscar planes por rango de precio');
    }
  }

  async findByDuration(durationInMonths: number): Promise<Plan[]> {
    try {
      return await this.planRepository.find({
        where: { durationInMonths },
        order: { price: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al buscar planes por duración');
    }
  }

  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    try {
      const plan = await this.findOne(id);
      Object.assign(plan, updatePlanDto);
      return await this.planRepository.save(plan);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el plan');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const plan = await this.findOne(id);
      await this.planRepository.remove(plan);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el plan');
    }
  }

  async softDelete(id: string): Promise<Plan> {
    try {
      const plan = await this.findOne(id);
      plan.isActive = false;
      return await this.planRepository.save(plan);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al desactivar el plan');
    }
  }

  async activate(id: string): Promise<Plan> {
    try {
      const plan = await this.findOne(id);
      plan.isActive = true;
      return await this.planRepository.save(plan);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al activar el plan');
    }
  }
}
