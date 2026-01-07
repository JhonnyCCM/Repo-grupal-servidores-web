import { Controller, Get, Post, Body, Logger, Param } from '@nestjs/common';
import { ClasesService } from './clases.service';
import { Clase } from './entities/clase.entity';

@Controller('clases')
export class ClasesController {
  private readonly logger = new Logger(ClasesController.name);

  constructor(private readonly clasesService: ClasesService) { }

  @Get()
  async findAll() {
    return this.clasesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.clasesService.findOne(+id);
  }


  @Post()
  async create(@Body() data: Partial<Clase>) {
    this.logger.log('Creating clase via HTTP endpoint');
    return this.clasesService.create(data);
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
