import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentResolver } from './payment.resolver';
import { PaymentHttpService } from './payment-http.service';
import { UserModule } from '../user/user.module';
import { MembershipModule } from '../membership/membership.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => UserModule),
    forwardRef(() => MembershipModule),
  ],
  providers: [PaymentResolver, PaymentHttpService],
  exports: [PaymentHttpService],
})
export class PaymentModule {}
