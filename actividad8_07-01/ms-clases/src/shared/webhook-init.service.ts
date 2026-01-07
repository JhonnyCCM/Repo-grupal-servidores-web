import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WebhookPublisherService } from '../webhooks/webhook-publisher.service';

@Injectable()
export class WebhookInitService implements OnModuleInit {
  private readonly logger = new Logger(WebhookInitService.name);

  constructor(private readonly webhookPublisher: WebhookPublisherService) {
    this.logger.log('🔧 WebhookInitService instantiated');
  }

  async onModuleInit() {
    this.logger.log('🚀 WebhookInitService.onModuleInit() called');
    // Auto-registrar Edge Functions de Supabase al iniciar
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
      const existingSubscriptions = await this.webhookPublisher.getSubscriptions();
      this.logger.log(`Found ${existingSubscriptions.length} existing subscriptions`);
      
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
            ['clase.created', 'clase.updated'], // Eventos específicos
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
}
