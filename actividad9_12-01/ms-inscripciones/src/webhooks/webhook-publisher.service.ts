import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createHmac, randomUUID } from 'crypto';
import { WebhookSubscription } from './entities/webhook-subscription.entity';
import { WebhookDelivery, WebhookDeliveryStatus } from './entities/webhook-delivery.entity';
import { WebhookPayload, WebhookEvent } from './interfaces/webhook-payload.interface';

@Injectable()
export class WebhookPublisherService implements OnModuleInit {
  private readonly logger = new Logger(WebhookPublisherService.name);

  constructor(
    @InjectRepository(WebhookSubscription)
    private readonly subscriptionRepo: Repository<WebhookSubscription>,
    @InjectRepository(WebhookDelivery)
    private readonly deliveryRepo: Repository<WebhookDelivery>,
    @InjectQueue('webhook-delivery')
    private readonly webhookQueue: Queue,
  ) {}

  async onModuleInit() {
    this.logger.log('🚀 WebhookPublisherService initialized - Auto-registering Supabase Edge Functions');
    await this.registerSupabaseWebhooks();
  }

  private async registerSupabaseWebhooks() {
    try {
      this.logger.log('📝 Starting Supabase webhook registration...');
      
      const eventLoggerUrl = process.env.WEBHOOK_EVENT_LOGGER_URL;
      const notifierUrl = process.env.WEBHOOK_EXTERNAL_NOTIFIER_URL;
      const secret = process.env.WEBHOOK_SECRET;

      this.logger.log(`Event Logger URL: ${eventLoggerUrl || 'NOT SET'}`);
      this.logger.log(`Notifier URL: ${notifierUrl || 'NOT SET'}`);
      this.logger.log(`Secret configured: ${secret ? 'YES' : 'NO'}`);

      if (!secret) {
        this.logger.warn('WEBHOOK_SECRET not configured, skipping webhook registration');
        return;
      }

      // Verificar si ya están registrados
      const existingSubscriptions = await this.getSubscriptions();
      this.logger.log(`Found ${existingSubscriptions.length} existing subscriptions`);
      
      // Registrar Edge Function 1 (Event Logger) si no existe
      if (eventLoggerUrl) {
        const loggerExists = existingSubscriptions.some(sub => sub.url === eventLoggerUrl);
        
        if (!loggerExists) {
          await this.registerSubscription(
            eventLoggerUrl,
            ['*'], // Todos los eventos
            secret
          );
          this.logger.log(`✅ Registered Edge Function 1 (Event Logger): ${eventLoggerUrl}`);
        } else {
          this.logger.log(`ℹ️ Edge Function 1 (Event Logger) already registered`);
        }
      }

      // Registrar Edge Function 2 (External Notifier) si no existe
      if (notifierUrl) {
        const notifierExists = existingSubscriptions.some(sub => sub.url === notifierUrl);
        
        if (!notifierExists) {
          await this.registerSubscription(
            notifierUrl,
            ['inscripcion.created', 'inscripcion.updated'], // Eventos específicos de inscripciones
            secret
          );
          this.logger.log(`✅ Registered Edge Function 2 (External Notifier): ${notifierUrl}`);
        } else {
          this.logger.log(`ℹ️ Edge Function 2 (External Notifier) already registered`);
        }
      }

      if (!eventLoggerUrl && !notifierUrl) {
        this.logger.warn('No Supabase Edge Function URLs configured');
      }
      
      this.logger.log('✅ Webhook registration completed');
    } catch (error) {
      this.logger.error(`Failed to register Supabase webhooks: ${error.message}`, error.stack);
    }
  }

  /**
   * Publica un evento de webhook a todos los suscriptores
   */
  async publishEvent(event: WebhookEvent): Promise<void> {
    try {
      this.logger.log(`Publishing webhook event: ${event.type}`);

      // Obtener todas las suscripciones activas para este evento
      const subscriptions = await this.subscriptionRepo.find({
        where: { active: true },
      });

      const relevantSubscriptions = subscriptions.filter(sub =>
        sub.events.includes(event.type) || sub.events.includes('*'),
      );

      if (relevantSubscriptions.length === 0) {
        this.logger.warn(`No active subscriptions found for event: ${event.type}`);
        return;
      }

      // Crear payload estándar
      const payload = this.createStandardPayload(event);

      // Crear y encolar entrega para cada suscripción
      for (const subscription of relevantSubscriptions) {
        await this.queueDelivery(subscription, payload, event.type);
      }

      this.logger.log(
        `Queued ${relevantSubscriptions.length} webhook deliveries for event: ${event.type}`,
      );
    } catch (error) {
      this.logger.error(`Error publishing webhook event: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Crea un payload estándar de webhook
   */
  private createStandardPayload(event: WebhookEvent): WebhookPayload {
    return {
      event: event.type,
      version: '1.0',
      id: randomUUID(),
      idempotency_key: randomUUID(),
      timestamp: new Date().toISOString(),
      data: event.data,
      metadata: {
        source: 'ms-inscripciones',
        environment: process.env.NODE_ENV || 'development',
        correlation_id: event.correlationId || randomUUID(),
      },
    };
  }

  /**
   * Encola una entrega de webhook
   */
  private async queueDelivery(
    subscription: WebhookSubscription,
    payload: WebhookPayload,
    event: string,
  ): Promise<void> {
    // Registrar el intento de entrega en la base de datos
    const delivery = this.deliveryRepo.create({
      webhookId: payload.id,
      subscriptionId: subscription.id,
      event,
      payload,
      status: WebhookDeliveryStatus.PENDING,
      attempts: 0,
    });

    await this.deliveryRepo.save(delivery);

    // Agregar a la cola de Bull para procesamiento
    await this.webhookQueue.add(
      'deliver-webhook',
      {
        deliveryId: delivery.id,
        subscriptionId: subscription.id,
        url: subscription.url,
        payload,
        secret: subscription.secret,
      },
      {
        attempts: 5, // Intentos máximos
        backoff: {
          type: 'exponential',
          delay: 2000, // 2 segundos inicialmente
        },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );
  }

  /**
   * Genera firma HMAC-SHA256 para el payload
   */
  generateSignature(payload: string, secret: string): string {
    return createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Registra el resultado de una entrega
   */
  async recordDeliveryResult(
    deliveryId: string,
    success: boolean,
    responseStatus?: number,
    responseBody?: string,
    errorMessage?: string,
  ): Promise<void> {
    const delivery = await this.deliveryRepo.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      this.logger.error(`Delivery not found: ${deliveryId}`);
      return;
    }

    delivery.attempts += 1;
    delivery.responseStatus = responseStatus;
    delivery.responseBody = responseBody?.substring(0, 5000); // Limitar tamaño
    delivery.errorMessage = errorMessage?.substring(0, 5000);

    if (success) {
      delivery.status = WebhookDeliveryStatus.SUCCESS;
      delivery.deliveredAt = new Date();
    } else {
      delivery.status =
        delivery.attempts >= 5
          ? WebhookDeliveryStatus.FAILED
          : WebhookDeliveryStatus.RETRYING;
    }

    await this.deliveryRepo.save(delivery);
  }

  /**
   * Registra un webhook subscription
   */
  async registerSubscription(
    url: string,
    events: string[],
    secret?: string,
  ): Promise<WebhookSubscription> {
    const subscription = this.subscriptionRepo.create({
      url,
      events,
      secret: secret || this.generateSecret(),
      active: true,
    });

    return this.subscriptionRepo.save(subscription);
  }

  /**
   * Genera un secreto aleatorio para firmar webhooks
   */
  private generateSecret(): string {
    return randomUUID() + randomUUID();
  }

  /**
   * Obtiene todas las suscripciones
   */
  async getSubscriptions(): Promise<WebhookSubscription[]> {
    return this.subscriptionRepo.find();
  }

  /**
   * Obtiene el historial de entregas para una suscripción
   */
  async getDeliveryHistory(subscriptionId: string): Promise<WebhookDelivery[]> {
    return this.deliveryRepo.find({
      where: { subscriptionId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
