import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GymClassResolver } from './gym-class.resolver';
import { GymClassHttpService } from './gym-class-http.service';
import { CoachModule } from '../coach/coach.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => CoachModule), // Para evitar referencias circulares
  ],
  providers: [GymClassResolver, GymClassHttpService],
  exports: [GymClassHttpService],
})
export class GymClassModule {}