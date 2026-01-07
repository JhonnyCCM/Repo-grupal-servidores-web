import { Controller, Get, Logger } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';

@Controller('inscripciones')
export class InscripcionesController {
  private readonly logger = new Logger(InscripcionesController.name);

  constructor(private readonly inscripcionesService: InscripcionesService) {}

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
