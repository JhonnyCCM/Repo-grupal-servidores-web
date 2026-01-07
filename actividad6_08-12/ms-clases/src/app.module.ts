import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClasesModule } from './clases/clases.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres-clases',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'gym_clases',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo/taller
      logging: true,
    }),
    ClasesModule,
  ],
})
export class AppModule {}
