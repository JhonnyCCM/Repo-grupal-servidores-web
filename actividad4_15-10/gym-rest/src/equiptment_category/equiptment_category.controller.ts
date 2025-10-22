import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { EquiptmentCategoryService } from './equiptment_category.service';
import { CreateEquiptmentCategoryDto } from './dto/create-equiptment_category.dto';
import { UpdateEquiptmentCategoryDto } from './dto/update-equiptment_category.dto';
import { EquiptmentCategory } from './entities/equiptment_category.entity';

@ApiTags('equipment-categories')
@Controller('equipment-categories')
export class EquiptmentCategoryController {
  constructor(private readonly equiptmentCategoryService: EquiptmentCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Asociar un equipo con una categoría' })
  @ApiResponse({ 
    status: 201, 
    description: 'Asociación creada exitosamente',
    type: EquiptmentCategory 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'La asociación ya existe' })
  create(@Body() createEquiptmentCategoryDto: CreateEquiptmentCategoryDto): Promise<EquiptmentCategory> {
    return this.equiptmentCategoryService.create(createEquiptmentCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las asociaciones equipo-categoría' })
  @ApiQuery({ 
    name: 'equiptmentId', 
    required: false, 
    description: 'Filtrar por ID de equipo' 
  })
  @ApiQuery({ 
    name: 'categoryId', 
    required: false, 
    description: 'Filtrar por ID de categoría' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de asociaciones obtenida exitosamente',
    type: [EquiptmentCategory] 
  })
  findAll(
    @Query('equiptmentId') equiptmentId?: string,
    @Query('categoryId') categoryId?: string
  ): Promise<EquiptmentCategory[]> {
    return this.equiptmentCategoryService.findAll(equiptmentId, categoryId);
  }

  @Get('equipment/:equiptmentId')
  @ApiOperation({ summary: 'Obtener categorías de un equipo específico' })
  @ApiParam({ name: 'equiptmentId', description: 'ID del equipo' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categorías del equipo obtenidas exitosamente',
    type: [EquiptmentCategory] 
  })
  findByEquipment(@Param('equiptmentId', ParseUUIDPipe) equiptmentId: string): Promise<EquiptmentCategory[]> {
    return this.equiptmentCategoryService.findByEquipment(equiptmentId);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Obtener equipos de una categoría específica' })
  @ApiParam({ name: 'categoryId', description: 'ID de la categoría' })
  @ApiResponse({ 
    status: 200, 
    description: 'Equipos de la categoría obtenidos exitosamente',
    type: [EquiptmentCategory] 
  })
  findByCategory(@Param('categoryId', ParseUUIDPipe) categoryId: string): Promise<EquiptmentCategory[]> {
    return this.equiptmentCategoryService.findByCategory(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una asociación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la asociación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Asociación encontrada',
    type: EquiptmentCategory 
  })
  @ApiResponse({ status: 404, description: 'Asociación no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<EquiptmentCategory> {
    return this.equiptmentCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una asociación equipo-categoría' })
  @ApiParam({ name: 'id', description: 'ID de la asociación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Asociación actualizada exitosamente',
    type: EquiptmentCategory 
  })
  @ApiResponse({ status: 404, description: 'Asociación no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'La asociación ya existe' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateEquiptmentCategoryDto: UpdateEquiptmentCategoryDto
  ): Promise<EquiptmentCategory> {
    return this.equiptmentCategoryService.update(id, updateEquiptmentCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una asociación equipo-categoría' })
  @ApiParam({ name: 'id', description: 'ID de la asociación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Asociación eliminada exitosamente' 
  })
  @ApiResponse({ status: 404, description: 'Asociación no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.equiptmentCategoryService.remove(id);
  }

  @Delete('equipment/:equiptmentId/category/:categoryId')
  @ApiOperation({ summary: 'Eliminar asociación por equipo y categoría' })
  @ApiParam({ name: 'equiptmentId', description: 'ID del equipo' })
  @ApiParam({ name: 'categoryId', description: 'ID de la categoría' })
  @ApiResponse({ 
    status: 200, 
    description: 'Asociación eliminada exitosamente' 
  })
  @ApiResponse({ status: 404, description: 'Asociación no encontrada' })
  removeByEquipmentAndCategory(
    @Param('equiptmentId', ParseUUIDPipe) equiptmentId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string
  ): Promise<{ message: string }> {
    return this.equiptmentCategoryService.removeByEquipmentAndCategory(equiptmentId, categoryId);
  }
}
