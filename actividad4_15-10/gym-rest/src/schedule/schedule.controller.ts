import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo horario' })
  @ApiResponse({ 
    status: 201, 
    description: 'Horario creado exitosamente',
    type: Schedule 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los horarios' })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Buscar horarios por nombre' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de horarios obtenida exitosamente',
    type: [Schedule] 
  })
  findAll(@Query('search') search?: string): Promise<Schedule[]> {
    return this.scheduleService.findAll(search);
  }

  @Get('by-time-range')
  @ApiOperation({ summary: 'Obtener horarios por rango de tiempo' })
  @ApiQuery({ name: 'startTime', description: 'Hora de inicio (HH:MM)' })
  @ApiQuery({ name: 'endTime', description: 'Hora de fin (HH:MM)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Horarios en el rango de tiempo especificado',
    type: [Schedule] 
  })
  findByTimeRange(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string
  ): Promise<Schedule[]> {
    return this.scheduleService.findByTimeRange(startTime, endTime);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un horario por ID' })
  @ApiParam({ name: 'id', description: 'ID del horario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Horario encontrado',
    type: Schedule 
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Schedule> {
    return this.scheduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un horario' })
  @ApiParam({ name: 'id', description: 'ID del horario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Horario actualizado exitosamente',
    type: Schedule 
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateScheduleDto: UpdateScheduleDto
  ): Promise<Schedule> {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un horario' })
  @ApiParam({ name: 'id', description: 'ID del horario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Horario eliminado exitosamente' 
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.scheduleService.remove(id);
  }
}
