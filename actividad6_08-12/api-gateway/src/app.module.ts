import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClasesController } from './clases/clases.controller';
import { InscripcionesController } from './inscripciones/inscripciones.controller';
import { HealthController } from './health/health.controller';
import { RabbitMQService } from './shared/rabbitmq.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
          queue: 'gateway_queue',
          queueOptions: {
            durable: true,
          },
          prefetchCount: 1,
        },
      },
    ]),
  ],
  controllers: [ClasesController, InscripcionesController, HealthController],
  providers: [RabbitMQService],
})
export class AppModule {}
