import { Module } from '@nestjs/common';
import { StatsResolver } from './stats.resolver';
import { UserModule } from '../user/user.module';
import { CoachModule } from '../coach/coach.module';
import { GymClassModule } from '../gym-classes/gym-class.module';
import { EquipmentModule } from '../equipment/equipment.module';

@Module({
  imports: [UserModule, CoachModule, GymClassModule, EquipmentModule],
  providers: [StatsResolver],
})
export class StatsModule {}