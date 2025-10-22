import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EquipmentResolver } from './equipment.resolver';
import { EquipmentHttpService } from './equipment-http.service';

@Module({
  imports: [HttpModule],
  providers: [EquipmentResolver, EquipmentHttpService],
  exports: [EquipmentHttpService],
})
export class EquipmentModule {}