import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { WebhookSubscription } from './entities/webhook-subscription.entity';
import { WebhookDelivery } from './entities/webhook-delivery.entity';
import { WebhookPublisherService } from './webhook-publisher.service';
import { WebhookDeliveryProcessor } from './webhook-delivery.processor';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebhookSubscription, WebhookDelivery]),
    BullModule.registerQueue({
      name: 'webhook-delivery',
      defaultJobOptions: {
        removeOnComplete: 100, // Mantener últimos 100 trabajos completados
        removeOnFail: 500, // Mantener últimos 500 trabajos fallidos
      },
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
  ],
  controllers: [WebhooksController],
  providers: [WebhookPublisherService, WebhookDeliveryProcessor],
  exports: [WebhookPublisherService],
})
export class WebhooksModule {}
