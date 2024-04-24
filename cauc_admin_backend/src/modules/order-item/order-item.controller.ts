import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Auth, IsSuper } from '../../decorator/auth.decorator';
import { OrderItemService } from './order-item.service';

@Controller('order-item')
export class OrderItemController {
    constructor(
        private readonly orderItemService: OrderItemService
    ) { }


    // 为订单指派讲解员
    @Post('assign')
    @Auth()
    async assignGuide(
        @Body('order_item_id') order_item_id: number,
        @Body('guide_id') guide_id: number,
    ) {
        // console.log('order_item_id:', order_item_id);
        // console.log('guide_id:', guide_id);
        return await this.orderItemService.assignGuide(order_item_id, guide_id);
    }


    // 取消订单讲解员之间关联
    @Post('remove')
    @Auth()
    async removeGuide(
        @Body('order_item_id') order_item_id: number,
    ) {
        return await this.orderItemService.removeGuide(order_item_id);
    }


    // -------------------- S U P E R ----------------------

    @Get('list')
    @IsSuper()
    async getOrderItemListByGuideId(
        @Query('guide_id', ParseIntPipe) guide_id: number,
        @Query('type', ParseIntPipe) type: number,
    ) {
        const type_str = type === 0 ? 'unfinish' : type === 1 ? 'finish' : 'all';
        return await this.orderItemService.getOrderItemListByGuideId(guide_id, type_str);
    }



}
