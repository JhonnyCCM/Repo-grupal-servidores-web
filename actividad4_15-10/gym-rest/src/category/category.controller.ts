import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ 
    status: 201, 
    description: 'Categoría creada exitosamente',
    type: Category 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una categoría con este nombre' })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Buscar categorías por nombre o descripción' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de categorías obtenida exitosamente',
    type: [Category] 
  })
  findAll(@Query('search') search?: string): Promise<Category[]> {
    return this.categoryService.findAll(search);
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener categorías activas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de categorías activas',
    type: [Category] 
  })
  getActive(): Promise<Category[]> {
    return this.categoryService.getActiveCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoría encontrada',
    type: Category 
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoría actualizada exitosamente',
    type: Category 
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una categoría con este nombre' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoría eliminada exitosamente' 
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.categoryService.remove(id);
  }
}
