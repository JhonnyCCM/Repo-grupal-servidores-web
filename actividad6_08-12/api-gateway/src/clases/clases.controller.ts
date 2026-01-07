import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RabbitMQService } from '../shared/rabbitmq.service';
import { CreateClaseDto } from './dto/create-clase.dto';

@ApiTags('clases')
@Controller('clases')
export class ClasesController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Crear una nueva clase' })
  @ApiResponse({ status: 202, description: 'Solicitud de creación aceptada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createClaseDto: CreateClaseDto) {
    // Enviar mensaje al microservicio de clases
    const result = await this.rabbitMQService.sendMessage({
      action: 'create',
      payload: createClaseDto,
    });

    return {
      message: 'Clase creation request received',
      ...result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las clases' })
  @ApiResponse({ status: 200, description: 'Lista de clases obtenida exitosamente' })
  async findAll() {
    // Solicitar datos al microservicio de clases via RabbitMQ
    const clases = await this.rabbitMQService.sendRequest(
      'gym.clases.queue',
      'gym.clases.reply.queue',
      { action: 'findAll' },
    );

    return clases;
  }
}
