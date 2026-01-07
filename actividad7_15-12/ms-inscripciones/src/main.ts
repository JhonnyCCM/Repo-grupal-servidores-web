import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar microservicio RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
      queue: 'gym.class.enroll',
      queueOptions: {
        durable: true,
      },
      prefetchCount: 1, // Procesar un mensaje a la vez para consistencia
    },
  });

  await app.startAllMicroservices();
  
  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  console.log(`📝 MS-Inscripciones running on http://localhost:${port}`);
  console.log(`🐰 Listening to RabbitMQ queue: gym.class.enroll`);
  console.log(`🛡️ Idempotent Consumer enabled with Redis`);
}

bootstrap();
