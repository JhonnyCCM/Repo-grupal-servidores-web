import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RabbitMQService } from '../shared/rabbitmq.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';

@ApiTags('inscripciones')
@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Crear una nueva inscripción' })
  @ApiResponse({ status: 202, description: 'Solicitud de inscripción aceptada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createInscripcionDto: CreateInscripcionDto) {
    // Enviar mensaje al microservicio de clases para inscribir
    const result = await this.rabbitMQService.sendMessage({
      action: 'enroll',
      payload: createInscripcionDto,
    });

    return {
      message: 'Enrollment request received',
      ...result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las inscripciones' })
  @ApiResponse({ status: 200, description: 'Lista de inscripciones obtenida exitosamente' })
  async findAll() {
    // Solicitar datos al microservicio de inscripciones via RabbitMQ
    const inscripciones = await this.rabbitMQService.sendRequest(
      'gym.inscripciones.queue',
      'gym.inscripciones.reply.queue',
      { action: 'findAll' },
    );

    return inscripciones;
  }
}
