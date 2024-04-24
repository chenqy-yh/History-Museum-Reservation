import { Module } from '@nestjs/common';
import { GuideController } from './guide.controller';
import { GuideService } from './guide.service';
import { OrderItemService } from '../order-item/order-item.service';

@Module({
  controllers: [GuideController],
  providers: [GuideService, OrderItemService]
})
export class GuideModule { }
