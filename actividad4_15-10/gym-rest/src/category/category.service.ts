import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      // Verificar si ya existe una categoría con el mismo nombre
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: createCategoryDto.name }
      });

      if (existingCategory) {
        throw new ConflictException('Ya existe una categoría con este nombre');
      }

      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear la categoría');
    }
  }

  async findAll(search?: string): Promise<Category[]> {
    try {
      const queryBuilder = this.categoryRepository.createQueryBuilder('category');

      if (search) {
        queryBuilder.where(
          '(category.name LIKE :search OR category.description LIKE :search)',
          { search: `%${search}%` }
        );
      }

      queryBuilder.orderBy('category.name', 'ASC');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException('Error al obtener las categorías');
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      
      if (!category) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener la categoría');
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      const category = await this.findOne(id);

      // Si se está actualizando el nombre, verificar que no exista otra categoría con el mismo nombre
      if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
        const existingCategory = await this.categoryRepository.findOne({
          where: { name: updateCategoryDto.name }
        });

        if (existingCategory) {
          throw new ConflictException('Ya existe una categoría con este nombre');
        }
      }

      Object.assign(category, updateCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar la categoría');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const category = await this.findOne(id);
      await this.categoryRepository.remove(category);
      return { message: `Categoría con ID ${id} eliminada correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la categoría');
    }
  }

  async findByName(name: string): Promise<Category | null> {
    try {
      return await this.categoryRepository.findOne({ where: { name } });
    } catch (error) {
      throw new BadRequestException('Error al buscar categoría por nombre');
    }
  }

  async getActiveCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({
        order: { name: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener categorías activas');
    }
  }
}
