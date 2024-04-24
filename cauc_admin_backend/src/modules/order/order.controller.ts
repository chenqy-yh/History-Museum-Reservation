import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { OrderErrorStatusPipe, OrderOperateStatusPipe, OrderStatusPipe } from '../../pipe/order.pipe';
import { Auth } from '../../decorator/auth.decorator';
import { NumberArrayParsePipe } from '../../pipe/number-arr-parse.pipe';
import { MonthListFormatPipe, StringArrayParsePipe } from '../../pipe/string-arr-parse.pipe';
import { All_OPERATE_STATUS_TYPE, All_ORDER_ERROR_STATUS_TYPE, All_ORDER_STATUS_TYPE } from '../../utils/enum';
import { OrderService } from './order.service';
import { NumberParsePipe } from '../../pipe/common.pipe'

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get('getOrderCountByCreateAt')
    @Auth()
    async getOrderCountByCreateAt(
        @Query('date') date: string) {
        return await this.orderService.getOrderCountByCreateAt(date);
    }

    @Get('getOrderCountByDate')
    @Auth()
    async getOrderCountByDate(
        @Query('date') date: string) {
        return await this.orderService.getOrderCountByDate(date);
    }


    //获取订单总数
    @Get('count')
    @Auth()
    async getOrderCount(
        @Query('operate_status_list', NumberArrayParsePipe) operate_status_list: number[] = [],
        @Query('order_status_list', NumberArrayParsePipe) order_status_list: number[] = [],
        @Query('error_status_list', NumberArrayParsePipe) error_status_list: number[] = [],
        @Query('date', StringArrayParsePipe) date_list: string[] = [],
        @Query('guide_assign', NumberParsePipe) guide_assign: number = 0,
    ) {
        if (operate_status_list === undefined || operate_status_list.length === 0) {
            operate_status_list = All_OPERATE_STATUS_TYPE
        }

        if (order_status_list === undefined || order_status_list.length === 0) {
            order_status_list = All_ORDER_STATUS_TYPE
        }

        if (error_status_list === undefined || error_status_list.length === 0) {
            error_status_list = All_ORDER_ERROR_STATUS_TYPE
        }

        return await this.orderService.getOrderCount({
            operate_status_list: operate_status_list ?? All_OPERATE_STATUS_TYPE,
            order_status_list: order_status_list ?? All_ORDER_STATUS_TYPE,
            error_status_list: error_status_list ?? All_ORDER_ERROR_STATUS_TYPE,
            date_list: date_list ?? [],
            guide_assign: guide_assign ?? 0,
        });
    }

    //分页查询订单
    @Get('/')
    // @Auth()
    async findOrder(
        @Query('p', ParseIntPipe) page: number,
        @Query('s', ParseIntPipe) size: number,

        @Query('operate_status_list', NumberArrayParsePipe) operate_status_list: number[] = [],
        @Query('order_status_list', NumberArrayParsePipe) order_status_list: number[] = [],
        @Query('error_status_list', NumberArrayParsePipe) error_status_list: number[] = [],
        @Query('guide_assign', NumberParsePipe) guide_assign: number = 0,
        @Query('date', StringArrayParsePipe) date_list: string[] = [],
    ) {
        if (operate_status_list === undefined || operate_status_list.length === 0) {
            operate_status_list = All_OPERATE_STATUS_TYPE
        }

        if (order_status_list === undefined || order_status_list.length === 0) {
            order_status_list = All_ORDER_STATUS_TYPE
        }

        if (error_status_list === undefined || error_status_list.length === 0) {
            error_status_list = All_ORDER_ERROR_STATUS_TYPE
        }

        // console.log('findOrder:', orderTypeList, date_list);
        return this.orderService.findOrder({
            page, size,
            operate_status_list,
            order_status_list,
            error_status_list,
            guide_assign,
            date_list
        });
    }

    // 更新订单 操作 状态
    @Post('update/operatestatus')
    @Auth()
    async updateOrderOperateStatus(
        @Body('order_id', NumberParsePipe) order_id: number,
        @Body('operate_status', OrderOperateStatusPipe) operate_status: number,
    ) {
        return await this.orderService.changeOrderOperateStatusById({
            order_id: order_id,
            operate_status: operate_status
        });
    }



    // 更新订单 状态
    @Post('update/orderstatus')
    @Auth()
    async updateOrderStatus(
        @Body('order_id', NumberParsePipe) order_id: number,
        @Body('order_status', OrderStatusPipe) operate_status: number,
    ) {
        return await this.orderService.changeOrderStatusById({
            order_id: order_id,
            order_status: operate_status
        });
    }

    // 更新订单 错误 状态
    @Post('update/errorstatus')
    @Auth()
    async updateOrderErrorStatus(
        @Body('order_id', NumberParsePipe) order_id: number,
        @Body('order_error_status', OrderErrorStatusPipe) order_error_status: number,
    ) {
        return await this.orderService.changeOrderErrorStatusById({
            order_id: order_id,
            order_error_status: order_error_status
        });
    }


    // ---------------------------------------- FOR GUIDE ----------------------------------------------


    @Get('printExcel/day')
    @Auth()
    async printExcelByDay(
        @Query('day_list') day_list: string[],
    ) {
        return this.orderService.findOrderByDateList(day_list);
    }

    @Get('printExcel/month')
    async printExcelByMonth(
        @Query('month_list', MonthListFormatPipe) month_list: string[],
    ) {
        return this.orderService.findOrderByMonthList(month_list);
    }

    @Get('printExcel/year')
    async printExcelByYear(
        @Query('year_list') year_list: string[],
    ) {
        console.log(year_list);
        return this.orderService.findOrderByYearList(year_list);
    }

}
