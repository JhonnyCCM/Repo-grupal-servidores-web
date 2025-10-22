import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Configurar CORS con origen desde variables de entorno
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Configuración de Swagger usando variables de entorno
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'Gym API')
    .setDescription(process.env.SWAGGER_DESCRIPTION || 'API REST para gestión de gimnasio')
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .addTag('coaches', 'Operaciones relacionadas con entrenadores')
    .addTag('equipments', 'Operaciones relacionadas con equipos')
    .addTag('gym-classes', 'Operaciones relacionadas con clases de gimnasio')
    .addTag('users', 'Operaciones relacionadas con usuarios')
    .addTag('plans', 'Operaciones relacionadas con planes de membresía')
    .addTag('memberships', 'Operaciones relacionadas con membresías')
    .addTag('payments', 'Operaciones relacionadas con pagos')
    .addTag('categories', 'Operaciones relacionadas con categorías')
    .addTag('rooms', 'Operaciones relacionadas con salones')
    .addTag('schedules', 'Operaciones relacionadas con horarios')
    .addTag('gym-class-categories', 'Operaciones relacionadas con asociaciones clase-categoría')
    .addTag('equipment-categories', 'Operaciones relacionadas con asociaciones equipo-categoría')
    .addTag('class-enrollments', 'Operaciones relacionadas con inscripciones a clases')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
