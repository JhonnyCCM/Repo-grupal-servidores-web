import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WebhookPublisherService } from './webhook-publisher.service';

interface WebhookDeliveryJob {
  deliveryId: string;
  subscriptionId: string;
  url: string;
  payload: any;
  secret: string;
}

@Processor('webhook-delivery')
export class WebhookDeliveryProcessor {
  private readonly logger = new Logger(WebhookDeliveryProcessor.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly webhookPublisher: WebhookPublisherService,
  ) {}

  @Process('deliver-webhook')
  async handleWebhookDelivery(job: Job<WebhookDeliveryJob>): Promise<void> {
    const { deliveryId, url, payload, secret } = job.data;

    this.logger.log(
      `Processing webhook delivery ${deliveryId} (attempt ${job.attemptsMade + 1}/${job.opts.attempts})`,
    );

    try {
      // Convertir payload a string para firmar
      const payloadString = JSON.stringify(payload);

      // Generar firma HMAC-SHA256
      const signature = this.webhookPublisher.generateSignature(payloadString, secret);

      // Enviar HTTP POST
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Id': payload.id,
            'X-Webhook-Timestamp': payload.timestamp,
          },
          timeout: 10000, // 10 segundos
          validateStatus: (status) => status >= 200 && status < 300,
        }),
      );

      // Registrar éxito
      await this.webhookPublisher.recordDeliveryResult(
        deliveryId,
        true,
        response.status,
        JSON.stringify(response.data).substring(0, 1000),
      );

      this.logger.log(`Successfully delivered webhook ${deliveryId} to ${url}`);
    } catch (error) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;
      const statusCode = error.response?.status;

      this.logger.error(
        `Failed to deliver webhook ${deliveryId} (attempt ${job.attemptsMade + 1}): ${errorMessage}`,
      );

      // Registrar fallo
      await this.webhookPublisher.recordDeliveryResult(
        deliveryId,
        false,
        statusCode,
        undefined,
        errorMessage,
      );

      // Re-lanzar el error para que Bull maneje el retry
      throw error;
    }
  }
}
