import { Body, Controller, Get, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { Auth, NotBan } from '../decorator/auth.decorator';
import { RecordService } from '../record/record.service';
import { OrderService } from './order.service';
import { OrderCreateDto } from '../model/order';
import { NumberParsePipe } from '../pipe/arr-parse.pipe'

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly recordService: RecordService
    ) { }

    // 根据用户openid查询订单
    @Get('queryorder')
    @Auth()
    async findOrderByUserId(@Req() req: Request, openid: string) {
        const user = req.user as any;
        return await this.orderService.queryOrderByOpenid(openid);
    }


    //创建订单
    // {
    //     permission_name: 'cqy',
    //     permission_tel: '13333333333',
    //     organize: '空中交通管理学院',
    //     org_type: 0,
    //     size_list: [ 44, 55 ],
    //     time_list: [ '2023-11-13 09:00', '2023-11-13 09:30' ],
    //     time_idx_list: [ 1, 2 ],
    //     need: true,
    //     sub_pm_type: 'IMG',
    //     url: 'https://cauc-img-2-1300131488.cos.ap-beijing.myqcloud.com/68fab1b9da15cd819f10916d9d309ef4c.jpg',
    //     openid: 'owUCH62NgdweQHBNYWa1ZNA3gtuQ'
    // }
    @Post('createOrder')
    @Auth()
    @NotBan()
    async createOrder(@Req() req: Request, @Body() data: OrderCreateDto) {
        const openid = (req.user as any).openid;
        data.openid = openid;
        return await this.orderService.createOrder(data);
    }


    // 取消订单
    @Post('cancelOrder')
    @Auth()
    @NotBan()
    async cancelOrder(@Req() req: Request, @Body('order_id') orderid) {
        const openid = (req.user as any).openid;
        return await this.orderService.cancelOrder(orderid, openid);
    }


}
