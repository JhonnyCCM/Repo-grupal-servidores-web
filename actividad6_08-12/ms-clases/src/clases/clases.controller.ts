import { Controller, Get, Logger } from '@nestjs/common';
import { ClasesService } from './clases.service';

@Controller('clases')
export class ClasesController {
  private readonly logger = new Logger(ClasesController.name);

  constructor(private readonly clasesService: ClasesService) {}

  @Get()
  async findAll() {
    return this.clasesService.findAll();
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'ms-clases',
      timestamp: new Date().toISOString(),
    };
  }
}
