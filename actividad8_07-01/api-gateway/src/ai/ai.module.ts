import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [AiController],
})
export class AiModule {}
