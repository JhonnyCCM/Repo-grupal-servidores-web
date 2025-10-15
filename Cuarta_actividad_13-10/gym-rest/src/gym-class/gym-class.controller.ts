import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus,
  ParseUUIDPipe,
  Query
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiBody,
  ApiQuery
} from '@nestjs/swagger';
import { GymClassService } from './gym-class.service';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { UpdateGymClassDto } from './dto/update-gym-class.dto';
import { GymClass } from './entities/gym-class.entity';
import { DifficultyLevel } from '../common/enums';

@ApiTags('gym-classes')
@Controller('gym-classes')
export class GymClassController {
  constructor(private readonly gymClassService: GymClassService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva clase de gimnasio' })
  @ApiBody({ type: CreateGymClassDto })
  @ApiResponse({ status: 201, description: 'Clase creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async create(@Body() createGymClassDto: CreateGymClassDto): Promise<GymClass> {
    return await this.gymClassService.create(createGymClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las clases de gimnasio' })
  @ApiQuery({ name: 'difficulty', enum: DifficultyLevel, required: false, description: 'Filtrar por nivel de dificultad' })
  @ApiQuery({ name: 'active', type: 'boolean', required: false, description: 'Filtrar solo clases activas' })
  @ApiResponse({ status: 200, description: 'Lista de clases obtenida exitosamente.' })
  async findAll(
    @Query('difficulty') difficulty?: DifficultyLevel,
    @Query('active') active?: string
  ): Promise<GymClass[]> {
    if (active === 'true') {
      return await this.gymClassService.findActiveClasses();
    }
    if (difficulty) {
      return await this.gymClassService.findByDifficultyLevel(difficulty);
    }
    return await this.gymClassService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una clase por ID' })
  @ApiParam({ name: 'id', description: 'ID de la clase', type: 'string' })
  @ApiResponse({ status: 200, description: 'Clase encontrada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Clase no encontrada.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GymClass> {
    return await this.gymClassService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una clase' })
  @ApiParam({ name: 'id', description: 'ID de la clase', type: 'string' })
  @ApiBody({ type: UpdateGymClassDto })
  @ApiResponse({ status: 200, description: 'Clase actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Clase no encontrada.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateGymClassDto: UpdateGymClassDto
  ): Promise<GymClass> {
    return await this.gymClassService.update(id, updateGymClassDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una clase' })
  @ApiParam({ name: 'id', description: 'ID de la clase', type: 'string' })
  @ApiResponse({ status: 204, description: 'Clase eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Clase no encontrada.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.gymClassService.remove(id);
  }

  @Get('coach/:coachId')
  @ApiOperation({ summary: 'Obtener clases por entrenador' })
  @ApiParam({ name: 'coachId', description: 'ID del entrenador', type: 'string' })
  @ApiResponse({ status: 200, description: 'Clases del entrenador obtenidas exitosamente.' })
  async findByCoach(@Param('coachId', ParseUUIDPipe) coachId: string): Promise<GymClass[]> {
    return await this.gymClassService.findByCoach(coachId);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Cambiar el estado activo de una clase' })
  @ApiParam({ name: 'id', description: 'ID de la clase', type: 'string' })
  @ApiResponse({ status: 200, description: 'Estado de la clase actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Clase no encontrada.' })
  async toggleActiveStatus(@Param('id', ParseUUIDPipe) id: string): Promise<GymClass> {
    return await this.gymClassService.toggleActiveStatus(id);
  }
}
