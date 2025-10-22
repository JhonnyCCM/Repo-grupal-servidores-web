import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoachResolver } from './coach.resolver';
import { CoachHttpService } from './coach-http.service';
import { GymClassModule } from 'src/gym-classes/gym-class.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => GymClassModule), // Para evitar referencias circulares
  ],
  providers: [CoachResolver, CoachHttpService],
  exports: [CoachHttpService],
})
export class CoachModule {}