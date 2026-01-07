import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { IdempotencyService } from './idempotency.service';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private readonly QUEUE_INSCRIPCIONES = 'gym.inscripciones.queue';
  private messageHandler: (msg: any, channel?: any, originalMsg?: any) => Promise<any>;

  constructor(private readonly idempotencyService: IdempotencyService) {}

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
    
    this.connection = amqp.connect([url], {
      heartbeatIntervalInSeconds: 30,
    });

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: any) => {
        // Crear cola para recibir operaciones de inscripciones
        await channel.assertQueue(this.QUEUE_INSCRIPCIONES, { durable: true });
        
        // Consumir mensajes con verificación de idempotencia
        await channel.consume(this.QUEUE_INSCRIPCIONES, async (msg) => {
          if (msg !== null) {
            try {
              const content = JSON.parse(msg.content.toString());
              const { messageId, data } = content;
              const correlationId = msg.properties.correlationId;
              const replyTo = msg.properties.replyTo;
              
              this.logger.log(`📥 Message received | ID: ${messageId || correlationId}`);
              
              // Si es una petición (tiene replyTo), procesarla directamente sin idempotencia
              if (replyTo && correlationId) {
                if (this.messageHandler) {
                  const result = await this.messageHandler(content, channel, msg);
                  
                  await channel.sendToQueue(
                    replyTo,
                    Buffer.from(JSON.stringify(result)),
                    {
                      correlationId,
                      contentType: 'application/json',
                    }
                  );
                  this.logger.log(`📤 Reply sent to ${replyTo}`);
                }
                channel.ack(msg);
                return;
              }
              
              // Para mensajes normales (con messageId), verificar idempotencia
              if (messageId) {
                const alreadyProcessed = await this.idempotencyService.isProcessed(messageId);
                
                if (alreadyProcessed) {
                  this.logger.warn(`⚠️ Duplicate message ignored | ID: ${messageId}`);
                  channel.ack(msg);
                  return;
                }
              }
              
              // Procesar mensaje
              if (this.messageHandler) {
                await this.messageHandler(content, channel, msg);
              }
              
              // Marcar como procesado si tiene messageId
              if (messageId) {
                await this.idempotencyService.markAsProcessed(messageId);
              }
              
              channel.ack(msg);
            } catch (error) {
              this.logger.error(`❌ Error processing message: ${error.message}`);
              channel.nack(msg, false, false);
            }
          }
        });
        
        this.logger.log('✅ RabbitMQ configured for MS-Inscripciones with idempotency');
      },
    });

    this.connection.on('connect', () => {
      this.logger.log('🐰 Connected to RabbitMQ');
    });

    this.connection.on('disconnect', (err) => {
      this.logger.error('❌ Disconnected from RabbitMQ:', err?.err?.message || 'Unknown error');
    });
  }

  setMessageHandler(handler: (msg: any, channel?: any, originalMsg?: any) => Promise<any>) {
    this.messageHandler = handler;
  }
}
