import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClassService } from './gym-class.service';
import { GymClassController } from './gym-class.controller';
import { GymClass } from './entities/gym-class.entity';
import { CoachModule } from '../coach/coach.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GymClass]),
    CoachModule // Importamos CoachModule para poder usar CoachService
  ],
  controllers: [GymClassController],
  providers: [GymClassService],
  exports: [GymClassService],
})
export class GymClassModule {}
