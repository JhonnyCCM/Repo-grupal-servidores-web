import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CoachService } from './coach.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { Coach } from './entities/coach.entity';

@ApiTags('coaches')
@Controller('coaches')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo entrenador' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Entrenador creado exitosamente',
    type: Coach
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El correo electrónico ya está en uso'
  })
  create(@Body() createCoachDto: CreateCoachDto): Promise<Coach> {
    return this.coachService.create(createCoachDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los entrenadores' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de entrenadores obtenida exitosamente',
    type: [Coach]
  })
  findAll(): Promise<Coach[]> {
    return this.coachService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener todos los entrenadores activos' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de entrenadores activos obtenida exitosamente',
    type: [Coach]
  })
  findActive(): Promise<Coach[]> {
    return this.coachService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un entrenador por ID' })
  @ApiParam({ name: 'id', description: 'ID del entrenador', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Entrenador encontrado',
    type: Coach
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Entrenador no encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'ID inválido'
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Coach> {
    return this.coachService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Obtener un entrenador por email' })
  @ApiParam({ name: 'email', description: 'Email del entrenador', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Entrenador encontrado',
    type: Coach
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Entrenador no encontrado'
  })
  findByEmail(@Param('email') email: string): Promise<Coach> {
    return this.coachService.findByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un entrenador' })
  @ApiParam({ name: 'id', description: 'ID del entrenador', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Entrenador actualizado exitosamente',
    type: Coach
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Entrenador no encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El correo electrónico ya está en uso'
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCoachDto: UpdateCoachDto): Promise<Coach> {
    return this.coachService.update(id, updateCoachDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar un entrenador (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del entrenador', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Entrenador desactivado exitosamente',
    type: Coach
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Entrenador no encontrado'
  })
  softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<Coach> {
    return this.coachService.softDelete(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un entrenador permanentemente' })
  @ApiParam({ name: 'id', description: 'ID del entrenador', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Entrenador eliminado exitosamente'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Entrenador no encontrado'
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.coachService.remove(id);
  }
}
