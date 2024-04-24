import { HttpException, HttpStatus } from "@nestjs/common";
import { Order } from "@prisma/client";
import { OperateStatusType, OrderErrorStatusType, OrderStatusType } from "../../utils/enum";


export const operateStatusToSolve = (order: Order) => {
    if (order.operate_status !== OperateStatusType.UNSOLVE) {
        throw new HttpException('update operate status [Solve] error', HttpStatus.BAD_REQUEST)
    }
    order.operate_status = OperateStatusType.SOLVE;
}



export const orderStatusToFinish = (order: Order) => {
    if (order.order_status !== OrderStatusType.UNFINISH) {
        throw new HttpException('update order status [FINISH] error', HttpStatus.BAD_REQUEST)
    }
    order.order_status = OrderStatusType.FINISH;
}

export const orderErrorStatusTypeToMiss = (order: Order) => {
    if (order.error_status !== OrderErrorStatusType.NONE) {
        throw new HttpException('update error status [MISS] error', HttpStatus.BAD_REQUEST)
    }
    operateStatusToSolve(order);
    orderStatusToFinish(order);
    order.error_status = OrderErrorStatusType.MISS;
}

export const orderErrorStatusTypeToLate = (order: Order) => {
    if (order.error_status !== OrderErrorStatusType.NONE) {
        throw new HttpException('update error status [LATE] error', HttpStatus.BAD_REQUEST)
    }
    operateStatusToSolve(order);
    orderStatusToFinish(order);
    order.error_status = OrderErrorStatusType.LATE;
}

export const orderErrorStatusTypeToCancel = (order: Order) => {
    if (order.error_status !== OrderErrorStatusType.NONE) {
        throw new HttpException('update error status [CANCEL] error', HttpStatus.BAD_REQUEST)
    }
    operateStatusToSolve(order);
    orderStatusToFinish(order);
    order.error_status = OrderErrorStatusType.CANCEL;
}

export const orderErrorStatusTypeToReject = (order: Order) => {
    if (order.error_status !== OrderErrorStatusType.NONE) {
        throw new HttpException('update error status [REJECT] error', HttpStatus.BAD_REQUEST)
    }
    operateStatusToSolve(order);
    orderStatusToFinish(order);
    order.error_status = OrderErrorStatusType.REJECT;
}