import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserResolver } from './user.resolver';
import { UserHttpService } from './user-http.service';

@Module({
  imports: [HttpModule],
  providers: [UserResolver, UserHttpService],
  exports: [UserHttpService],
})
export class UserModule {}