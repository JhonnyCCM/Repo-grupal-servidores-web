import { Controller, Get, Logger, Post, Body } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { randomUUID } from 'crypto';


@Controller('inscripciones')
export class InscripcionesController {
  private readonly logger = new Logger(InscripcionesController.name);

  constructor(private readonly inscripcionesService: InscripcionesService) { }

  @Post()
  async create(@Body() body: {
    claseId: number;
    alumno: string;
    email: string;
  }) {
    this.logger.log(`📩 POST /inscripciones recibido`);

    const messageId = randomUUID();

    const inscripcion = await this.inscripcionesService.create(messageId, {
      claseId: body.claseId,
      alumno: body.alumno,
      email: body.email,
    });

    return {
      received: true,
      messageId,
      inscripcionId: inscripcion.id,
    };
  }

  @Get()
  async findAll() {
    return this.inscripcionesService.findAll();
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'ms-inscripciones',
      timestamp: new Date().toISOString(),
    };
  }

}
