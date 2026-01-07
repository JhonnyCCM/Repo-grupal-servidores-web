import { Injectable, Inject, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);
  private readonly TTL = 86400; // 24 horas en segundos
  private readonly PREFIX = 'idempotent:';

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /**
   * Verifica si un mensaje ya fue procesado
   * @param messageId ID único del mensaje
   * @returns true si ya fue procesado, false si es nuevo
   */
  async isProcessed(messageId: string): Promise<boolean> {
    const key = this.PREFIX + messageId;
    const exists = await this.redis.exists(key);
    
    if (exists) {
      this.logger.warn(`⚠️ Message ${messageId} already processed (idempotent skip)`);
      return true;
    }
    
    return false;
  }

  /**
   * Marca un mensaje como procesado
   * @param messageId ID único del mensaje
   */
  async markAsProcessed(messageId: string): Promise<void> {
    const key = this.PREFIX + messageId;
    const value = JSON.stringify({
      processedAt: new Date().toISOString(),
      messageId,
    });

    await this.redis.set(key, value, 'EX', this.TTL);
    this.logger.log(`✅ Message ${messageId} marked as processed (TTL: ${this.TTL}s)`);
  }

  /**
   * Obtiene información de un mensaje procesado
   * @param messageId ID único del mensaje
   */
  async getProcessedInfo(messageId: string): Promise<any> {
    const key = this.PREFIX + messageId;
    const data = await this.redis.get(key);
    
    if (!data) {
      return null;
    }

    const ttl = await this.redis.ttl(key);
    return {
      ...JSON.parse(data),
      ttl,
    };
  }
}
