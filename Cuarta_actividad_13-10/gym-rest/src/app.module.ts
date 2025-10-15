import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClassModule } from './gym-class/gym-class.module';
import { MachineModule } from './machine/machine.module';
import { CoachModule } from './coach/coach.module';

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
    MachineModule,
    CoachModule,
    // Aquí se importarán los módulos de cada entidad
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
