import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGymClassCategoryDto } from './dto/create-gym-class_category.dto';
import { UpdateGymClassCategoryDto } from './dto/update-gym-class_category.dto';
import { GymClassCategory } from './entities/gym-class_category.entity';

@Injectable()
export class GymClassCategoryService {
  constructor(
    @InjectRepository(GymClassCategory)
    private readonly gymClassCategoryRepository: Repository<GymClassCategory>,
  ) {}

  async create(createGymClassCategoryDto: CreateGymClassCategoryDto): Promise<GymClassCategory> {
    try {
      // Verificar si ya existe la relación
      const existing = await this.gymClassCategoryRepository.findOne({
        where: {
          classId: createGymClassCategoryDto.classId,
          categoryId: createGymClassCategoryDto.categoryId
        }
      });

      if (existing) {
        throw new ConflictException('Esta clase ya está asociada a esta categoría');
      }

      const gymClassCategory = this.gymClassCategoryRepository.create(createGymClassCategoryDto);
      return await this.gymClassCategoryRepository.save(gymClassCategory);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear la asociación clase-categoría');
    }
  }

  async findAll(classId?: string, categoryId?: string): Promise<GymClassCategory[]> {
    try {
      const queryBuilder = this.gymClassCategoryRepository.createQueryBuilder('gymClassCategory');

      if (classId) {
        queryBuilder.where('gymClassCategory.classId = :classId', { classId });
      }

      if (categoryId) {
        queryBuilder.andWhere('gymClassCategory.categoryId = :categoryId', { categoryId });
      }

      queryBuilder.orderBy('gymClassCategory.createdAt', 'DESC');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException('Error al obtener las asociaciones clase-categoría');
    }
  }

  async findOne(id: string): Promise<GymClassCategory> {
    try {
      const gymClassCategory = await this.gymClassCategoryRepository.findOne({ where: { id } });
      
      if (!gymClassCategory) {
        throw new NotFoundException(`Asociación clase-categoría con ID ${id} no encontrada`);
      }

      return gymClassCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener la asociación clase-categoría');
    }
  }

  async update(id: string, updateGymClassCategoryDto: UpdateGymClassCategoryDto): Promise<GymClassCategory> {
    try {
      const gymClassCategory = await this.findOne(id);

      // Si se está actualizando, verificar que no exista otra relación igual
      if (updateGymClassCategoryDto.classId || updateGymClassCategoryDto.categoryId) {
        const classId = updateGymClassCategoryDto.classId || gymClassCategory.classId;
        const categoryId = updateGymClassCategoryDto.categoryId || gymClassCategory.categoryId;

        const existing = await this.gymClassCategoryRepository.findOne({
          where: { classId, categoryId }
        });

        if (existing && existing.id !== id) {
          throw new ConflictException('Esta clase ya está asociada a esta categoría');
        }
      }

      Object.assign(gymClassCategory, updateGymClassCategoryDto);
      return await this.gymClassCategoryRepository.save(gymClassCategory);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar la asociación clase-categoría');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const gymClassCategory = await this.findOne(id);
      await this.gymClassCategoryRepository.remove(gymClassCategory);
      return { message: `Asociación clase-categoría con ID ${id} eliminada correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la asociación clase-categoría');
    }
  }

  async findByClass(classId: string): Promise<GymClassCategory[]> {
    try {
      return await this.gymClassCategoryRepository.find({
        where: { classId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener categorías de la clase');
    }
  }

  async findByCategory(categoryId: string): Promise<GymClassCategory[]> {
    try {
      return await this.gymClassCategoryRepository.find({
        where: { categoryId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener clases de la categoría');
    }
  }

  async removeByClassAndCategory(classId: string, categoryId: string): Promise<{ message: string }> {
    try {
      const association = await this.gymClassCategoryRepository.findOne({
        where: { classId, categoryId }
      });

      if (!association) {
        throw new NotFoundException('No existe asociación entre esta clase y categoría');
      }

      await this.gymClassCategoryRepository.remove(association);
      return { message: 'Asociación eliminada correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la asociación');
    }
  }
}
