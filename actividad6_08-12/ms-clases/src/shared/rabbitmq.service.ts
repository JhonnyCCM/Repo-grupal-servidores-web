import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private readonly QUEUE_CLASES = 'gym.clases.queue';
  private readonly QUEUE_INSCRIPCIONES = 'gym.inscripciones.queue';
  private messageHandler: (msg: any, channel?: any, originalMsg?: any) => Promise<any>;

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
        // Crear cola para recibir operaciones de clases
        await channel.assertQueue(this.QUEUE_CLASES, { durable: true });
        
        // Crear cola para enviar mensajes a inscripciones
        await channel.assertQueue(this.QUEUE_INSCRIPCIONES, { durable: true });
        
        // Consumir mensajes de la cola de clases
        await channel.consume(this.QUEUE_CLASES, async (msg) => {
          if (msg !== null) {
            try {
              const content = JSON.parse(msg.content.toString());
              const correlationId = msg.properties.correlationId;
              const replyTo = msg.properties.replyTo;
              
              this.logger.log(`📥 Message received | ID: ${content.messageId || correlationId}`);
              
              if (this.messageHandler) {
                const result = await this.messageHandler(content, channel, msg);
                
                // Si hay replyTo, enviar respuesta (patrón request-reply)
                if (replyTo && correlationId) {
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
              }
              
              channel.ack(msg);
            } catch (error) {
              this.logger.error(`❌ Error processing message: ${error.message}`);
              channel.nack(msg, false, false);
            }
          }
        });
        
        this.logger.log('✅ RabbitMQ configured for MS-Clases');
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

  async sendToInscripciones(data: any): Promise<void> {
    await this.channelWrapper.sendToQueue(
      this.QUEUE_INSCRIPCIONES,
      data,
      {
        contentType: 'application/json',
        persistent: true,
      } as any
    );

    this.logger.log(`📤 Message sent to inscripciones`);
  }
}
