import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquiptmentCategoryDto } from './dto/create-equiptment_category.dto';
import { UpdateEquiptmentCategoryDto } from './dto/update-equiptment_category.dto';
import { EquiptmentCategory } from './entities/equiptment_category.entity';

@Injectable()
export class EquiptmentCategoryService {
  constructor(
    @InjectRepository(EquiptmentCategory)
    private readonly equiptmentCategoryRepository: Repository<EquiptmentCategory>,
  ) {}

  async create(createEquiptmentCategoryDto: CreateEquiptmentCategoryDto): Promise<EquiptmentCategory> {
    try {
      // Verificar si ya existe la relación
      const existing = await this.equiptmentCategoryRepository.findOne({
        where: {
          equiptmentId: createEquiptmentCategoryDto.equiptmentId,
          categoryId: createEquiptmentCategoryDto.categoryId
        }
      });

      if (existing) {
        throw new ConflictException('Este equipo ya está asociado a esta categoría');
      }

      const equiptmentCategory = this.equiptmentCategoryRepository.create(createEquiptmentCategoryDto);
      return await this.equiptmentCategoryRepository.save(equiptmentCategory);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear la asociación equipo-categoría');
    }
  }

  async findAll(equiptmentId?: string, categoryId?: string): Promise<EquiptmentCategory[]> {
    try {
      const queryBuilder = this.equiptmentCategoryRepository.createQueryBuilder('equiptmentCategory');

      if (equiptmentId) {
        queryBuilder.where('equiptmentCategory.equiptmentId = :equiptmentId', { equiptmentId });
      }

      if (categoryId) {
        queryBuilder.andWhere('equiptmentCategory.categoryId = :categoryId', { categoryId });
      }

      queryBuilder.orderBy('equiptmentCategory.createdAt', 'DESC');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException('Error al obtener las asociaciones equipo-categoría');
    }
  }

  async findOne(id: string): Promise<EquiptmentCategory> {
    try {
      const equiptmentCategory = await this.equiptmentCategoryRepository.findOne({ where: { id } });
      
      if (!equiptmentCategory) {
        throw new NotFoundException(`Asociación equipo-categoría con ID ${id} no encontrada`);
      }

      return equiptmentCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener la asociación equipo-categoría');
    }
  }

  async update(id: string, updateEquiptmentCategoryDto: UpdateEquiptmentCategoryDto): Promise<EquiptmentCategory> {
    try {
      const equiptmentCategory = await this.findOne(id);

      // Si se está actualizando, verificar que no exista otra relación igual
      if (updateEquiptmentCategoryDto.equiptmentId || updateEquiptmentCategoryDto.categoryId) {
        const equiptmentId = updateEquiptmentCategoryDto.equiptmentId || equiptmentCategory.equiptmentId;
        const categoryId = updateEquiptmentCategoryDto.categoryId || equiptmentCategory.categoryId;

        const existing = await this.equiptmentCategoryRepository.findOne({
          where: { equiptmentId, categoryId }
        });

        if (existing && existing.id !== id) {
          throw new ConflictException('Este equipo ya está asociado a esta categoría');
        }
      }

      Object.assign(equiptmentCategory, updateEquiptmentCategoryDto);
      return await this.equiptmentCategoryRepository.save(equiptmentCategory);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar la asociación equipo-categoría');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const equiptmentCategory = await this.findOne(id);
      await this.equiptmentCategoryRepository.remove(equiptmentCategory);
      return { message: `Asociación equipo-categoría con ID ${id} eliminada correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la asociación equipo-categoría');
    }
  }

  async findByEquipment(equiptmentId: string): Promise<EquiptmentCategory[]> {
    try {
      return await this.equiptmentCategoryRepository.find({
        where: { equiptmentId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener categorías del equipo');
    }
  }

  async findByCategory(categoryId: string): Promise<EquiptmentCategory[]> {
    try {
      return await this.equiptmentCategoryRepository.find({
        where: { categoryId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener equipos de la categoría');
    }
  }

  async removeByEquipmentAndCategory(equiptmentId: string, categoryId: string): Promise<{ message: string }> {
    try {
      const association = await this.equiptmentCategoryRepository.findOne({
        where: { equiptmentId, categoryId }
      });

      if (!association) {
        throw new NotFoundException('No existe asociación entre este equipo y categoría');
      }

      await this.equiptmentCategoryRepository.remove(association);
      return { message: 'Asociación eliminada correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la asociación');
    }
  }
}
