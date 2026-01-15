import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { Inscripcion } from './entities/inscripcion.entity';
import { IdempotencyService } from '../shared/idempotency.service';
import { RabbitMQModule } from '../shared/rabbitmq.module';
import { RabbitMQService } from '../shared/rabbitmq.service';
import { RedisModule } from '../shared/redis.module';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inscripcion]),
    HttpModule,
    RabbitMQModule,
    RedisModule,
    WebhooksModule,
  ],
  controllers: [InscripcionesController],
  providers: [InscripcionesService, IdempotencyService],
})
export class InscripcionesModule implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly inscripcionesService: InscripcionesService,
  ) {}

  async onModuleInit() {
    // Configurar handler para procesar mensajes con idempotencia
    this.rabbitMQService.setMessageHandler(async (msg) => {
      const { messageId, data } = msg;
      
      // Si tiene action 'findAll', responder con todas las inscripciones
      if (data && data.action === 'findAll') {
        const inscripciones = await this.inscripcionesService.findAll();
        return inscripciones;
      }
      
      // De lo contrario, procesar inscripción normal
      await this.inscripcionesService.create(messageId, data);
      return null;
    });
  }
}
