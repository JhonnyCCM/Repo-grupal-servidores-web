import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClassCategoryService } from './gym-class_category.service';
import { GymClassCategoryController } from './gym-class_category.controller';
import { GymClassCategory } from './entities/gym-class_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GymClassCategory])],
  controllers: [GymClassCategoryController],
  providers: [GymClassCategoryService],
  exports: [GymClassCategoryService],
})
export class GymClassCategoryModule {}
