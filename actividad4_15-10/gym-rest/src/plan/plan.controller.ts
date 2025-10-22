import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpStatus, Query, ParseFloatPipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';

@ApiTags('plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo plan' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Plan creado exitosamente',
    type: Plan
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.planService.create(createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los planes' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de planes obtenida exitosamente',
    type: [Plan]
  })
  findAll(): Promise<Plan[]> {
    return this.planService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener todos los planes activos' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de planes activos obtenida exitosamente',
    type: [Plan]
  })
  findActive(): Promise<Plan[]> {
    return this.planService.findActive();
  }

  @Get('price-range')
  @ApiOperation({ summary: 'Buscar planes por rango de precio' })
  @ApiQuery({ name: 'minPrice', description: 'Precio mínimo', type: 'number' })
  @ApiQuery({ name: 'maxPrice', description: 'Precio máximo', type: 'number' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Planes encontrados en el rango de precio',
    type: [Plan]
  })
  findByPriceRange(
    @Query('minPrice', ParseFloatPipe) minPrice: number,
    @Query('maxPrice', ParseFloatPipe) maxPrice: number
  ): Promise<Plan[]> {
    return this.planService.findByPriceRange(minPrice, maxPrice);
  }

  @Get('duration/:duration')
  @ApiOperation({ summary: 'Buscar planes por duración' })
  @ApiParam({ name: 'duration', description: 'Duración en meses', type: 'number' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Planes encontrados con la duración especificada',
    type: [Plan]
  })
  findByDuration(@Param('duration', ParseIntPipe) duration: number): Promise<Plan[]> {
    return this.planService.findByDuration(duration);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un plan por ID' })
  @ApiParam({ name: 'id', description: 'ID del plan', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Plan encontrado',
    type: Plan
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Plan no encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'ID inválido'
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Plan> {
    return this.planService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un plan' })
  @ApiParam({ name: 'id', description: 'ID del plan', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Plan actualizado exitosamente',
    type: Plan
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Plan no encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePlanDto: UpdatePlanDto): Promise<Plan> {
    return this.planService.update(id, updatePlanDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar un plan (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del plan', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Plan desactivado exitosamente',
    type: Plan
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Plan no encontrado'
  })
  softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<Plan> {
    return this.planService.softDelete(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activar un plan' })
  @ApiParam({ name: 'id', description: 'ID del plan', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Plan activado exitosamente',
    type: Plan
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Plan no encontrado'
  })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<Plan> {
    return this.planService.activate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un plan permanentemente' })
  @ApiParam({ name: 'id', description: 'ID del plan', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Plan eliminado exitosamente'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Plan no encontrado'
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.planService.remove(id);
  }
}
