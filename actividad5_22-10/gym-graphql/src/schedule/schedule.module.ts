import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleResolver } from './schedule.resolver';
import { ScheduleHttpService } from './schedule-http.service';

@Module({
  imports: [HttpModule],
  providers: [ScheduleResolver, ScheduleHttpService],
  exports: [ScheduleHttpService],
})
export class ScheduleModule {}
