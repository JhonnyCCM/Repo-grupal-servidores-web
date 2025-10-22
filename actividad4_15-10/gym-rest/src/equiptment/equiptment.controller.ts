import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EquiptmentService } from './equiptment.service';
import { CreateEquiptmentDto } from './dto/create-equiptment.dto';
import { UpdateEquiptmentDto } from './dto/update-equiptment.dto';
import { Equiptment } from './entities/equiptment.entity';
import { Status } from 'src/common/enums';

@ApiTags('equipments')
@Controller('equipments')
export class EquiptmentController {
  constructor(private readonly equiptmentService: EquiptmentService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo equipo' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Equipo creado exitosamente',
    type: Equiptment
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  create(@Body() createEquiptmentDto: CreateEquiptmentDto): Promise<Equiptment> {
    return this.equiptmentService.create(createEquiptmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los equipos' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de equipos obtenida exitosamente',
    type: [Equiptment]
  })
  findAll(): Promise<Equiptment[]> {
    return this.equiptmentService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener todos los equipos activos' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de equipos activos obtenida exitosamente',
    type: [Equiptment]
  })
  findActive(): Promise<Equiptment[]> {
    return this.equiptmentService.findActive();
  }

  @Get('maintenance')
  @ApiOperation({ summary: 'Obtener todos los equipos en mantenimiento' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de equipos en mantenimiento obtenida exitosamente',
    type: [Equiptment]
  })
  findInMaintenance(): Promise<Equiptment[]> {
    return this.equiptmentService.findInMaintenance();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar equipos por nombre' })
  @ApiQuery({ name: 'name', description: 'Nombre del equipo a buscar', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Resultados de búsqueda obtenidos exitosamente',
    type: [Equiptment]
  })
  searchByName(@Query('name') name: string): Promise<Equiptment[]> {
    return this.equiptmentService.searchByName(name);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener equipos por estado' })
  @ApiParam({ name: 'status', description: 'Estado del equipo', enum: Status })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de equipos por estado obtenida exitosamente',
    type: [Equiptment]
  })
  findByStatus(@Param('status') status: Status): Promise<Equiptment[]> {
    return this.equiptmentService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un equipo por ID' })
  @ApiParam({ name: 'id', description: 'ID del equipo', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Equipo encontrado',
    type: Equiptment
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Equipo no encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'ID inválido'
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Equiptment> {
    return this.equiptmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un equipo' })
  @ApiParam({ name: 'id', description: 'ID del equipo', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Equipo actualizado exitosamente',
    type: Equiptment
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Equipo no encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEquiptmentDto: UpdateEquiptmentDto): Promise<Equiptment> {
    return this.equiptmentService.update(id, updateEquiptmentDto);
  }

  @Patch(':id/maintenance')
  @ApiOperation({ summary: 'Marcar equipo en mantenimiento' })
  @ApiParam({ name: 'id', description: 'ID del equipo', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Equipo marcado en mantenimiento exitosamente',
    type: Equiptment
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Equipo no encontrado'
  })
  setMaintenance(@Param('id', ParseUUIDPipe) id: string): Promise<Equiptment> {
    return this.equiptmentService.setMaintenance(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activar equipo' })
  @ApiParam({ name: 'id', description: 'ID del equipo', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Equipo activado exitosamente',
    type: Equiptment
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Equipo no encontrado'
  })
  setActive(@Param('id', ParseUUIDPipe) id: string): Promise<Equiptment> {
    return this.equiptmentService.setActive(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un equipo permanentemente' })
  @ApiParam({ name: 'id', description: 'ID del equipo', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Equipo eliminado exitosamente'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Equipo no encontrado'
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.equiptmentService.remove(id);
  }
}
