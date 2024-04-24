import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { All_OPERATE_STATUS_TYPE, All_ORDER_ERROR_STATUS_TYPE, All_ORDER_STATUS_TYPE } from "../utils/enum";


// 订单操作状态管道
@Injectable()
export class OrderOperateStatusPipe implements PipeTransform<string | number, number>{
    transform(value: string | number, metadata: ArgumentMetadata): number {
        if (typeof value === 'string') {
            value = +value;
        }
        if (All_OPERATE_STATUS_TYPE.includes(value)) {
            return value;
        }
        throw new HttpException('operate_status参数错误', HttpStatus.BAD_REQUEST);
    }
}

// 订单状态管道
@Injectable()
export class OrderStatusPipe implements PipeTransform<string | number, number>{
    transform(value: string | number, metadata: ArgumentMetadata): number {
        if (typeof value === 'string') {
            value = +value;
        }
        // check is belong to OrderStatusType
        if (All_ORDER_STATUS_TYPE.includes(value)) {
            return value;
        }
        throw new HttpException('order_status参数错误', HttpStatus.BAD_REQUEST);
    }
}

// 订单错误状态管道
@Injectable()
export class OrderErrorStatusPipe implements PipeTransform<string | number, number>{
    transform(value: string | number, metadata: ArgumentMetadata): number {
        if (typeof value === 'string') {
            value = +value;
        }
        // check is belong to OrderStatusType
        if (All_ORDER_ERROR_STATUS_TYPE.includes(value)) {
            return value;
        }
        throw new HttpException('order_error参数错误', HttpStatus.BAD_REQUEST);
    }
}