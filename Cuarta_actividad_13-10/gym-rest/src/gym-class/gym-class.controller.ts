import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GymClassService } from './gym-class.service';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { UpdateGymClassDto } from './dto/update-gym-class.dto';

@Controller('gym-class')
export class GymClassController {
  constructor(private readonly gymClassService: GymClassService) {}

  @Post()
  create(@Body() createGymClassDto: CreateGymClassDto) {
    return this.gymClassService.create(createGymClassDto);
  }

  @Get()
  findAll() {
    return this.gymClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gymClassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGymClassDto: UpdateGymClassDto) {
    return this.gymClassService.update(+id, updateGymClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gymClassService.remove(+id);
  }
}
