import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GymClassCategoryResolver } from './gym-class-category.resolver';
import { GymClassCategoryHttpService } from './gym-class-category-http.service';

@Module({
  imports: [HttpModule],
  providers: [GymClassCategoryResolver, GymClassCategoryHttpService],
  exports: [GymClassCategoryHttpService],
})
export class GymClassCategoryModule {}