import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MembershipResolver } from './membership.resolver';
import { MembershipHttpService } from './membership-http.service';
import { UserModule } from '../user/user.module';
import { PlanModule } from '../plan/plan.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => UserModule),
    forwardRef(() => PlanModule),
  ],
  providers: [MembershipResolver, MembershipHttpService],
  exports: [MembershipHttpService],
})
export class MembershipModule {}
