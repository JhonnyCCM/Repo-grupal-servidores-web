import { Injectable } from '@nestjs/common';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { UpdateGymClassDto } from './dto/update-gym-class.dto';

@Injectable()
export class GymClassService {
  create(createGymClassDto: CreateGymClassDto) {
    return 'This action adds a new gymClass';
  }

  findAll() {
    return `This action returns all gymClass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gymClass`;
  }

  update(id: number, updateGymClassDto: UpdateGymClassDto) {
    return `This action updates a #${id} gymClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} gymClass`;
  }
}
