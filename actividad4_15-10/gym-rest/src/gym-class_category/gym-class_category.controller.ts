import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { GymClassCategoryService } from './gym-class_category.service';
import { CreateGymClassCategoryDto } from './dto/create-gym-class_category.dto';
import { UpdateGymClassCategoryDto } from './dto/update-gym-class_category.dto';
import { GymClassCategory } from './entities/gym-class_category.entity';

@ApiTags('gym-class-categories')
@Controller('gym-class-categories')
export class GymClassCategoryController {
  constructor(private readonly gymClassCategoryService: GymClassCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Asociar una clase con una categoría' })
  @ApiResponse({ 
    status: 201, 
    description: 'Asociación creada exitosamente',
    type: GymClassCategory 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'La asociación ya existe' })
  create(@Body() createGymClassCategoryDto: CreateGymClassCategoryDto): Promise<GymClassCategory> {
    return this.gymClassCategoryService.create(createGymClassCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las asociaciones clase-categoría' })
  @ApiQuery({ 
    name: 'classId', 
    required: false, 
    description: 'Filtrar por ID de clase' 
  })
  @ApiQuery({ 
    name: 'categoryId', 
    required: false, 
    description: 'Filtrar por ID de categoría' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de asociaciones obtenida exitosamente',
    type: [GymClassCategory] 
  })
  findAll(
    @Query('classId') classId?: string,
    @Query('categoryId') categoryId?: string
  ): Promise<GymClassCategory[]> {
    return this.gymClassCategoryService.findAll(classId, categoryId);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Obtener categorías de una clase específica' })
  @ApiParam({ name: 'classId', description: 'ID de la clase' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categorías de la clase obtenidas exitosamente',
    type: [GymClassCategory] 
  })
  findByClass(@Param('classId', ParseUUIDPipe) classId: string): Promise<GymClassCategory[]> {
    return this.gymClassCategoryService.findByClass(classId);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Obtener clases de una categoría específica' })
  @ApiParam({ name: 'categoryId', description: 'ID de la categoría' })
  @ApiResponse({ 
    status: 200, 
    description: 'Clases de la categoría obtenidas exitosamente',
    type: [GymClassCategory] 
  })
  findByCategory(@Param('categoryId', ParseUUIDPipe) categoryId: string): Promise<GymClassCategory[]> {
    return this.gymClassCategoryService.findByCategory(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una asociación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la asociación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Asociación encontrada',
    type: GymClassCategory 
  })
  @ApiResponse({ status: 404, description: 'Asociación no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GymClassCategory> {
    return this.gymClassCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una asociación clase-categoría' })
  @ApiParam({ name: 'id', description: 'ID de la asociación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Asociación actualizada exitosamente',
    type: GymClassCategory 
  })
  @ApiResponse({ status: 404, description: 'Asociación no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'La asociación ya existe' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateGymClassCategoryDto: UpdateGymClassCategoryDto
  ): Promise<GymClassCategory> {
    return this.gymClassCategoryService.update(id, updateGymClassCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una asociación clase-categoría' })
  @ApiParam({ name: 'id', description: 'ID de la asociación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Asociación eliminada exitosamente' 
  })
  @ApiResponse({ status: 404, description: 'Asociación no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.gymClassCategoryService.remove(id);
  }

  @Delete('class/:classId/category/:categoryId')
  @ApiOperation({ summary: 'Eliminar asociación por clase y categoría' })
  @ApiParam({ name: 'classId', description: 'ID de la clase' })
  @ApiParam({ name: 'categoryId', description: 'ID de la categoría' })
  @ApiResponse({ 
    status: 200, 
    description: 'Asociación eliminada exitosamente' 
  })
  @ApiResponse({ status: 404, description: 'Asociación no encontrada' })
  removeByClassAndCategory(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string
  ): Promise<{ message: string }> {
    return this.gymClassCategoryService.removeByClassAndCategory(classId, categoryId);
  }
}
