import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquiptmentCategoryService } from './equiptment_category.service';
import { EquiptmentCategoryController } from './equiptment_category.controller';
import { EquiptmentCategory } from './entities/equiptment_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EquiptmentCategory])],
  controllers: [EquiptmentCategoryController],
  providers: [EquiptmentCategoryService],
  exports: [EquiptmentCategoryService],
})
export class EquiptmentCategoryModule {}
