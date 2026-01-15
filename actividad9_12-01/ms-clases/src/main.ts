import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Crear aplicación híbrida (HTTP + RabbitMQ)
  const app = await NestFactory.create(AppModule);

  // Configurar microservicio RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
      queue: 'gym.class.create',
      queueOptions: {
        durable: true,
      },
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🏋️ MS-Clases running on http://localhost:${port}`);
  console.log(`🐰 Listening to RabbitMQ queue: gym.class.create`);
}

bootstrap();
