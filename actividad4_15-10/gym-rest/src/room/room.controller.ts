import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva sala' })
  @ApiResponse({ 
    status: 201, 
    description: 'Sala creada exitosamente',
    type: Room 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las salas' })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Buscar salas por nombre o descripción' 
  })
  @ApiQuery({ 
    name: 'minCapacity', 
    required: false, 
    description: 'Capacidad mínima' 
  })
  @ApiQuery({ 
    name: 'maxCapacity', 
    required: false, 
    description: 'Capacidad máxima' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de salas obtenida exitosamente',
    type: [Room] 
  })
  findAll(
    @Query('search') search?: string,
    @Query('minCapacity', ParseIntPipe) minCapacity?: number,
    @Query('maxCapacity', ParseIntPipe) maxCapacity?: number
  ): Promise<Room[]> {
    return this.roomService.findAll(search, minCapacity, maxCapacity);
  }

  @Get('available')
  @ApiOperation({ summary: 'Obtener salas disponibles' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de salas disponibles',
    type: [Room] 
  })
  findAvailable(): Promise<Room[]> {
    return this.roomService.findAvailableRooms();
  }

  @Get('by-capacity')
  @ApiOperation({ summary: 'Obtener salas por rango de capacidad' })
  @ApiQuery({ name: 'min', description: 'Capacidad mínima' })
  @ApiQuery({ name: 'max', description: 'Capacidad máxima' })
  @ApiResponse({ 
    status: 200, 
    description: 'Salas en el rango de capacidad especificado',
    type: [Room] 
  })
  findByCapacity(
    @Query('min', ParseIntPipe) min: number,
    @Query('max', ParseIntPipe) max: number
  ): Promise<Room[]> {
    return this.roomService.findByCapacityRange(min, max);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una sala por ID' })
  @ApiParam({ name: 'id', description: 'ID de la sala' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sala encontrada',
    type: Room 
  })
  @ApiResponse({ status: 404, description: 'Sala no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Room> {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una sala' })
  @ApiParam({ name: 'id', description: 'ID de la sala' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sala actualizada exitosamente',
    type: Room 
  })
  @ApiResponse({ status: 404, description: 'Sala no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateRoomDto: UpdateRoomDto
  ): Promise<Room> {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una sala' })
  @ApiParam({ name: 'id', description: 'ID de la sala' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sala eliminada exitosamente' 
  })
  @ApiResponse({ status: 404, description: 'Sala no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.roomService.remove(id);
  }
}
