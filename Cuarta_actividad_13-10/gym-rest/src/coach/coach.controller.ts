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
  ParseUUIDPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
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
  @ApiBody({ type: CreateCoachDto })
  @ApiResponse({ status: 201, description: 'Entrenador creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 409, description: 'Email ya registrado.' })
  async create(@Body() createCoachDto: CreateCoachDto): Promise<Coach> {
    return await this.coachService.create(createCoachDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los entrenadores' })
  @ApiResponse({ status: 200, description: 'Lista de entrenadores obtenida exitosamente.' })
  async findAll(): Promise<Coach[]> {
    return await this.coachService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un entrenador por ID' })
  @ApiParam({ name: 'id', description: 'ID del entrenador', type: 'string' })
  @ApiResponse({ status: 200, description: 'Entrenador encontrado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Coach> {
    return await this.coachService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un entrenador' })
  @ApiParam({ name: 'id', description: 'ID del entrenador', type: 'string' })
  @ApiBody({ type: UpdateCoachDto })
  @ApiResponse({ status: 200, description: 'Entrenador actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado.' })
  @ApiResponse({ status: 409, description: 'Email ya registrado.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCoachDto: UpdateCoachDto
  ): Promise<Coach> {
    return await this.coachService.update(id, updateCoachDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un entrenador' })
  @ApiParam({ name: 'id', description: 'ID del entrenador', type: 'string' })
  @ApiResponse({ status: 204, description: 'Entrenador eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.coachService.remove(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Buscar entrenador por email' })
  @ApiParam({ name: 'email', description: 'Email del entrenador', type: 'string' })
  @ApiResponse({ status: 200, description: 'Entrenador encontrado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado.' })
  async findByEmail(@Param('email') email: string): Promise<Coach> {
    const coach = await this.coachService.findByEmail(email);
    if (!coach) {
      throw new Error('Entrenador no encontrado');
    }
    return coach;
  }
}
