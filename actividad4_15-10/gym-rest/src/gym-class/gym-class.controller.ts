import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GymClassService } from './gym-class.service';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { UpdateGymClassDto } from './dto/update-gym-class.dto';
import { GymClass } from './entities/gym-class.entity';
import { DifficultyLevel } from 'src/common/enums';

@ApiTags('gym-classes')
@Controller('gym-classes')
export class GymClassController {
  constructor(private readonly gymClassService: GymClassService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva clase de gimnasio' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Clase de gimnasio creada exitosamente',
    type: GymClass
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  create(@Body() createGymClassDto: CreateGymClassDto): Promise<GymClass> {
    return this.gymClassService.create(createGymClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las clases de gimnasio' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de clases de gimnasio obtenida exitosamente',
    type: [GymClass]
  })
  findAll(): Promise<GymClass[]> {
    return this.gymClassService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener todas las clases activas' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de clases activas obtenida exitosamente',
    type: [GymClass]
  })
  findActive(): Promise<GymClass[]> {
    return this.gymClassService.findActive();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar clases por nombre' })
  @ApiQuery({ name: 'name', description: 'Nombre de la clase a buscar', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Resultados de búsqueda obtenidos exitosamente',
    type: [GymClass]
  })
  searchByName(@Query('name') name: string): Promise<GymClass[]> {
    return this.gymClassService.searchByName(name);
  }

  @Get('coach/:coachId')
  @ApiOperation({ summary: 'Obtener clases por entrenador' })
  @ApiParam({ name: 'coachId', description: 'ID del entrenador', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de clases del entrenador obtenida exitosamente',
    type: [GymClass]
  })
  findByCoach(@Param('coachId', ParseUUIDPipe) coachId: string): Promise<GymClass[]> {
    return this.gymClassService.findByCoach(coachId);
  }

  @Get('difficulty/:difficulty')
  @ApiOperation({ summary: 'Obtener clases por nivel de dificultad' })
  @ApiParam({ name: 'difficulty', description: 'Nivel de dificultad', enum: DifficultyLevel })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de clases por dificultad obtenida exitosamente',
    type: [GymClass]
  })
  findByDifficulty(@Param('difficulty') difficulty: DifficultyLevel): Promise<GymClass[]> {
    return this.gymClassService.findByDifficulty(difficulty);
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Obtener clases por salón' })
  @ApiParam({ name: 'roomId', description: 'ID del salón', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de clases del salón obtenida exitosamente',
    type: [GymClass]
  })
  findByRoom(@Param('roomId', ParseUUIDPipe) roomId: string): Promise<GymClass[]> {
    return this.gymClassService.findByRoom(roomId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una clase de gimnasio por ID' })
  @ApiParam({ name: 'id', description: 'ID de la clase', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Clase de gimnasio encontrada',
    type: GymClass
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Clase de gimnasio no encontrada'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'ID inválido'
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GymClass> {
    return this.gymClassService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una clase de gimnasio' })
  @ApiParam({ name: 'id', description: 'ID de la clase', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Clase de gimnasio actualizada exitosamente',
    type: GymClass
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Clase de gimnasio no encontrada'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateGymClassDto: UpdateGymClassDto): Promise<GymClass> {
    return this.gymClassService.update(id, updateGymClassDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar una clase de gimnasio (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID de la clase', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Clase desactivada exitosamente',
    type: GymClass
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Clase de gimnasio no encontrada'
  })
  softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<GymClass> {
    return this.gymClassService.softDelete(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activar una clase de gimnasio' })
  @ApiParam({ name: 'id', description: 'ID de la clase', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Clase activada exitosamente',
    type: GymClass
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Clase de gimnasio no encontrada'
  })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<GymClass> {
    return this.gymClassService.activate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una clase de gimnasio permanentemente' })
  @ApiParam({ name: 'id', description: 'ID de la clase', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Clase eliminada exitosamente'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Clase de gimnasio no encontrada'
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.gymClassService.remove(id);
  }
}
