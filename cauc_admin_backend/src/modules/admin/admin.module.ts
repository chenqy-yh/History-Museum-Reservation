import { Module } from '@nestjs/common';
import { UserController } from './admin.controller';
import { UserService } from './admin.service';

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
