import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RecordService } from '../record/record.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [OrderService, RecordService, UserService],
  controllers: [OrderController]
})
export class OrderModule { }
