import { Module } from '@nestjs/common';
import { GymClassService } from './gym-class.service';
import { GymClassController } from './gym-class.controller';

@Module({
  controllers: [GymClassController],
  providers: [GymClassService],
})
export class GymClassModule {}
