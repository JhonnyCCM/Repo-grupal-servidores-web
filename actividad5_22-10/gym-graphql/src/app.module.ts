// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { CoachModule } from './coach/coach.module';
import { GymClassModule } from './gym-classes/gym-class.module';
import { EquipmentModule } from './equipment/equipment.module';
import { StatsModule } from './stats/stats.module';
import { RoomModule } from './room/room.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PlanModule } from './plan/plan.module';
import { MembershipModule } from './membership/membership.module';
import { PaymentModule } from './payment/payment.module';
import { ClassEnrollmentModule } from './class-enrollment/class-enrollment.module';
import { CategoryModule } from './category/category.module';
import { EquipmentCategoryModule } from './equipment-category/equipment-category.module';
import { GymClassCategoryModule } from './gym-class-category/gym-class-category.module';

@Module({
 imports: [
 GraphQLModule.forRoot<ApolloDriverConfig>({
 driver: ApolloDriver,
 autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
 sortSchema: true,
 playground: true, // Apollo Playground habilitado
 introspection: true, // Para que funcione en producción también
 }),
 HttpModule.register({
 baseURL: 'http://localhost:3001', // URL del servicio REST
 timeout: 10000,
 maxRedirects: 5,
 }),
 // Módulos de resolvers
 UserModule,
 CoachModule,
 GymClassModule,
 EquipmentModule,
 StatsModule,
 RoomModule,
 ScheduleModule,
 PlanModule,
 MembershipModule,
 PaymentModule,
 ClassEnrollmentModule,
 CategoryModule,
 EquipmentCategoryModule,
 GymClassCategoryModule,
 ],
})
export class AppModule {}