import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachModule } from './coach/coach.module';
import { EquiptmentModule } from './equiptment/equiptment.module';
import { GymClassModule } from './gym-class/gym-class.module';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { MembershipModule } from './membership/membership.module';
import { PaymentModule } from './payment/payment.module';
import { CategoryModule } from './category/category.module';
import { RoomModule } from './room/room.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ClassEnrollmentModule } from './class_enrollment/class_enrollment.module';
import { EquiptmentCategoryModule } from './equiptment_category/equiptment_category.module';
import { GymClassCategoryModule } from './gym-class_category/gym-class_category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'gym-demo.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo desarrollo
      logging: true, // Para debug
    }),
    GymClassModule,
    CoachModule,
    CategoryModule,
    ClassEnrollmentModule,
    EquiptmentCategoryModule,
    EquiptmentModule,
    GymClassCategoryModule,
    MembershipModule,
    PaymentModule,
    PlanModule,
    RoomModule,
    ScheduleModule,
    UserModule,
    // Aquí se importarán los módulos de cada entidad
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
