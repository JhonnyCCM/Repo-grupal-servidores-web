import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEnrollmentService } from './class_enrollment.service';
import { ClassEnrollmentController } from './class_enrollment.controller';
import { ClassEnrollment } from './entities/class_enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEnrollment])],
  controllers: [ClassEnrollmentController],
  providers: [ClassEnrollmentService],
  exports: [ClassEnrollmentService],
})
export class ClassEnrollmentModule {}
