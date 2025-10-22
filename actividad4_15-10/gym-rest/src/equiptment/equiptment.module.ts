import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquiptmentService } from './equiptment.service';
import { EquiptmentController } from './equiptment.controller';
import { Equiptment } from './entities/equiptment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equiptment])],
  controllers: [EquiptmentController],
  providers: [EquiptmentService],
  exports: [EquiptmentService],
})
export class EquiptmentModule {}
