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
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Machine } from './entities/machine.entity';
import { Status } from '../common/enums';

@ApiTags('machines')
@Controller('machines')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva máquina' })
  @ApiBody({ type: CreateMachineDto })
  @ApiResponse({ status: 201, description: 'Máquina creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async create(@Body() createMachineDto: CreateMachineDto): Promise<Machine> {
    return await this.machineService.create(createMachineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las máquinas' })
  @ApiQuery({ name: 'status', enum: Status, required: false, description: 'Filtrar por estado' })
  @ApiResponse({ status: 200, description: 'Lista de máquinas obtenida exitosamente.' })
  async findAll(@Query('status') status?: Status): Promise<Machine[]> {
    if (status) {
      return await this.machineService.findByStatus(status);
    }
    return await this.machineService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una máquina por ID' })
  @ApiParam({ name: 'id', description: 'ID de la máquina', type: 'string' })
  @ApiResponse({ status: 200, description: 'Máquina encontrada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Máquina no encontrada.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Machine> {
    return await this.machineService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una máquina' })
  @ApiParam({ name: 'id', description: 'ID de la máquina', type: 'string' })
  @ApiBody({ type: UpdateMachineDto })
  @ApiResponse({ status: 200, description: 'Máquina actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Máquina no encontrada.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateMachineDto: UpdateMachineDto
  ): Promise<Machine> {
    return await this.machineService.update(id, updateMachineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una máquina' })
  @ApiParam({ name: 'id', description: 'ID de la máquina', type: 'string' })
  @ApiResponse({ status: 204, description: 'Máquina eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Máquina no encontrada.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.machineService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una máquina' })
  @ApiParam({ name: 'id', description: 'ID de la máquina', type: 'string' })
  @ApiBody({ schema: { type: 'object', properties: { status: { enum: Object.values(Status) } } } })
  @ApiResponse({ status: 200, description: 'Estado de la máquina actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Máquina no encontrada.' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: Status
  ): Promise<Machine> {
    return await this.machineService.updateStatus(id, status);
  }
}
