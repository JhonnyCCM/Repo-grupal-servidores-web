import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { WebhookPublisherService } from './webhook-publisher.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhookPublisher: WebhookPublisherService) {}

  @Post('subscriptions')
  async createSubscription(
    @Body() body: { url: string; events: string[]; secret?: string },
  ) {
    const subscription = await this.webhookPublisher.registerSubscription(
      body.url,
      body.events,
      body.secret,
    );
    
    return {
      success: true,
      subscription: {
        id: subscription.id,
        url: subscription.url,
        events: subscription.events,
        secret: subscription.secret,
        active: subscription.active,
      },
    };
  }

  @Get('subscriptions')
  async getSubscriptions() {
    const subscriptions = await this.webhookPublisher.getSubscriptions();
    return {
      success: true,
      count: subscriptions.length,
      subscriptions,
    };
  }

  @Get('subscriptions/:id/deliveries')
  async getDeliveries(@Param('id') id: string) {
    const deliveries = await this.webhookPublisher.getDeliveryHistory(id);
    return {
      success: true,
      count: deliveries.length,
      deliveries,
    };
  }
}
