import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS para desarrollo
  app.enableCors();

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Gym Management API')
    .setDescription('API Gateway para gestión de clases e inscripciones de gimnasio')
    .setVersion('1.0')
    .addTag('clases', 'Operaciones relacionadas con clases')
    .addTag('inscripciones', 'Operaciones relacionadas con inscripciones')
    .addTag('health', 'Endpoints de monitoreo y salud del sistema')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 API Gateway running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
