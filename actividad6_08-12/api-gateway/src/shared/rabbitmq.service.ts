import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private readonly QUEUE_CLASES = 'gym.clases.queue';
  private readonly QUEUE_CLASES_REPLY = 'gym.clases.reply.queue';
  private readonly QUEUE_INSCRIPCIONES_REPLY = 'gym.inscripciones.reply.queue';
  private pendingRequests = new Map<string, any>();

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
        // Crear cola para operaciones de clases
        await channel.assertQueue(this.QUEUE_CLASES, { durable: true });
        
        // Crear colas de respuesta
        await channel.assertQueue(this.QUEUE_CLASES_REPLY, { durable: true });
        await channel.assertQueue(this.QUEUE_INSCRIPCIONES_REPLY, { durable: true });
        
        // Consumir respuestas de clases
        await channel.consume(this.QUEUE_CLASES_REPLY, (msg) => {
          if (msg !== null) {
            const response = JSON.parse(msg.content.toString());
            const correlationId = msg.properties.correlationId;
            
            if (this.pendingRequests.has(correlationId)) {
              const { resolve } = this.pendingRequests.get(correlationId);
              resolve(response);
              this.pendingRequests.delete(correlationId);
            }
            
            channel.ack(msg);
          }
        });
        
        // Consumir respuestas de inscripciones
        await channel.consume(this.QUEUE_INSCRIPCIONES_REPLY, (msg) => {
          if (msg !== null) {
            const response = JSON.parse(msg.content.toString());
            const correlationId = msg.properties.correlationId;
            
            if (this.pendingRequests.has(correlationId)) {
              const { resolve } = this.pendingRequests.get(correlationId);
              resolve(response);
              this.pendingRequests.delete(correlationId);
            }
            
            channel.ack(msg);
          }
        });
        
        this.logger.log('✅ RabbitMQ configured for API Gateway');
      },
    });

    this.connection.on('connect', () => {
      this.logger.log('🐰 Connected to RabbitMQ');
    });

    this.connection.on('disconnect', (err) => {
      this.logger.error('❌ Disconnected from RabbitMQ:', err?.err?.message || 'Unknown error');
    });
  }

  async sendMessage(data: any): Promise<{ messageId: string; received: boolean }> {
    const messageId = uuidv4();
    const message = {
      messageId,
      data,
      timestamp: new Date().toISOString(),
    };

    await this.channelWrapper.sendToQueue(
      this.QUEUE_CLASES,
      message,
      {
        contentType: 'application/json',
        persistent: true,
      } as any
    );

    this.logger.log(`📤 Message sent to ${this.QUEUE_CLASES} | ID: ${messageId}`);
    
    return { messageId, received: true };
  }

  async sendRequest(queue: string, replyQueue: string, data: any, timeout: number = 5000): Promise<any> {
    const correlationId = uuidv4();
    const message = {
      correlationId,
      data,
      timestamp: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      // Timeout para evitar espera infinita
      const timer = setTimeout(() => {
        this.pendingRequests.delete(correlationId);
        reject(new Error('Request timeout'));
      }, timeout);

      this.pendingRequests.set(correlationId, {
        resolve: (response) => {
          clearTimeout(timer);
          resolve(response);
        },
      });

      this.channelWrapper.sendToQueue(
        queue,
        message,
        {
          contentType: 'application/json',
          correlationId,
          replyTo: replyQueue,
        } as any
      );

      this.logger.log(`📤 Request sent to ${queue} | ID: ${correlationId}`);
    });
  }
}
