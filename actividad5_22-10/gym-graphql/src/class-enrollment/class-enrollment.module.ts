import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClassEnrollmentResolver } from './class-enrollment.resolver';
import { ClassEnrollmentHttpService } from './class-enrollment-http.service';
import { UserModule } from '../user/user.module';
import { GymClassModule } from '../gym-classes/gym-class.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => UserModule),
    forwardRef(() => GymClassModule),
  ],
  providers: [ClassEnrollmentResolver, ClassEnrollmentHttpService],
  exports: [ClassEnrollmentHttpService],
})
export class ClassEnrollmentModule {}
