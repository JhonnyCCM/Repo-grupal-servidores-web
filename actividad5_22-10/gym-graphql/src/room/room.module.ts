import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RoomResolver } from './room.resolver';
import { RoomHttpService } from './room-http.service';

@Module({
  imports: [HttpModule],
  providers: [RoomResolver, RoomHttpService],
  exports: [RoomHttpService],
})
export class RoomModule {}
