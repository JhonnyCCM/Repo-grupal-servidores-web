import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Configurar CORS
  app.enableCors();

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Gym API')
    .setDescription('API REST para gestión de gimnasio')
    .setVersion('1.0')
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
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: http://localhost:3001`);
  console.log(`Swagger documentation available at: http://localhost:3001/api`);
}
bootstrap();
