
import { HttpException } from "@nestjs/common";
import { HttpCode } from "../../utils/enum";


// 日期不开放
export class OrderCreateException extends HttpException {
    constructor(msg) {
        super({
            msg: msg
        }, HttpCode.OrderCreate);
    }
}

// 订单不存在
export class OrderNotExistException extends HttpException {
    constructor(msg: string) {
        super({
            msg
        }, HttpCode.OrderNotExist);
    }
}

// 订单取消失败
export class OrderCancelException extends HttpException {
    constructor(msg) {
        super({
            msg: '订单取消失败',
            cause: msg,
        }, HttpCode.OrderNotExist);
    }
}
