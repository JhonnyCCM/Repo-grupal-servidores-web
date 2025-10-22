import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlanResolver } from './plan.resolver';
import { PlanHttpService } from './plan-http.service';

@Module({
  imports: [HttpModule],
  providers: [PlanResolver, PlanHttpService],
  exports: [PlanHttpService],
})
export class PlanModule {}
