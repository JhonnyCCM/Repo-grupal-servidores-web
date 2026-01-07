import { Module, Global } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { IdempotencyService } from './idempotency.service';
import { RedisModule } from './redis.module';

@Global()
@Module({
  imports: [RedisModule],
  providers: [RabbitMQService, IdempotencyService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
