import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WebhookPublisherService } from '../webhooks/webhook-publisher.service';

@Injectable()
export class WebhookInitService implements OnModuleInit {
  private readonly logger = new Logger(WebhookInitService.name);

  constructor(private readonly webhookPublisher: WebhookPublisherService) {}

  async onModuleInit() {
    // Auto-registrar Edge Functions de Supabase al iniciar
    await this.registerSupabaseWebhooks();
  }

  private async registerSupabaseWebhooks() {
    try {
      const eventLoggerUrl = process.env.WEBHOOK_EVENT_LOGGER_URL;
      const notifierUrl = process.env.WEBHOOK_EXTERNAL_NOTIFIER_URL;
      const secret = process.env.WEBHOOK_SECRET;

      if (!secret) {
        this.logger.warn('WEBHOOK_SECRET not configured, skipping webhook registration');
        return;
      }

      // Verificar si ya están registrados
      const existingSubscriptions = await this.webhookPublisher.getSubscriptions();
      
      // Registrar Edge Function 1 (Event Logger) si no existe
      if (eventLoggerUrl) {
        const loggerExists = existingSubscriptions.some(sub => sub.url === eventLoggerUrl);
        
        if (!loggerExists) {
          await this.webhookPublisher.registerSubscription(
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
          await this.webhookPublisher.registerSubscription(
            notifierUrl,
            ['inscripcion.created', 'inscripcion.updated'], // Eventos específicos
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
    } catch (error) {
      this.logger.error(`Failed to register Supabase webhooks: ${error.message}`, error.stack);
    }
  }
}
