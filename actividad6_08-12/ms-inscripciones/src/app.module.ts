import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { RedisModule } from './shared/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres-inscripciones',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'gym_inscripciones',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo/taller
      logging: true,
    }),
    RedisModule,
    InscripcionesModule,
  ],
})
export class AppModule {}
