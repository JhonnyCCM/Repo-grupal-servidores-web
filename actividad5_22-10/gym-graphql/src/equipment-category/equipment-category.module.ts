import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EquipmentCategoryResolver } from './equipment-category.resolver';
import { EquipmentCategoryHttpService } from './equipment-category-http.service';

@Module({
  imports: [HttpModule],
  providers: [EquipmentCategoryResolver, EquipmentCategoryHttpService],
  exports: [EquipmentCategoryHttpService],
})
export class EquipmentCategoryModule {}