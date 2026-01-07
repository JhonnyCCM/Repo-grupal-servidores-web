import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClasesService } from './clases.service';
import { ClasesController } from './clases.controller';
import { Clase } from './entities/clase.entity';
import { RabbitMQModule } from '../shared/rabbitmq.module';
import { RabbitMQService } from '../shared/rabbitmq.service';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clase]),
    RabbitMQModule,
    WebhooksModule,
  ],
  controllers: [ClasesController],
  providers: [ClasesService],
})
export class ClasesModule implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly clasesService: ClasesService,
  ) {}

  async onModuleInit() {
    // Configurar handler para procesar mensajes de la cola
    this.rabbitMQService.setMessageHandler(async (msg) => {
      const { messageId, data, correlationId } = msg;
      
      // Si tiene data.action, es un mensaje estructurado
      if (data && data.action) {
        const { action, payload } = data;
        
        if (action === 'create') {
          // Crear clase
          await this.clasesService.create(payload);
          return null; // No necesita respuesta
        } else if (action === 'enroll') {
          // Procesar inscripción: enviar a ms-inscripciones
          await this.rabbitMQService.sendToInscripciones({
            messageId,
            data: payload,
            timestamp: new Date().toISOString(),
          });
          return null; // No necesita respuesta
        } else if (action === 'findAll') {
          // Responder con todas las clases
          const clases = await this.clasesService.findAll();
          return clases;
        }
      }
      
      return null;
    });
  }
}
