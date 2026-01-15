import { Controller, Get, Post, Body, Logger, Param, Patch } from '@nestjs/common';
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

  @Patch(':id')
  async updateQuota(@Param('id') id: number, @Body() data: { cupo: number }) {
    this.logger.log(`Updating quota for clase ${id} to ${data.cupo}`);
    return this.clasesService.updateQuota(+id, data.cupo);
  }

  @Post(':id/decrement-quota')
  async decrementQuota(@Param('id') id: number) {
    this.logger.log(`Decrementing quota for clase ${id}`);
    return this.clasesService.decrementQuota(+id);
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
