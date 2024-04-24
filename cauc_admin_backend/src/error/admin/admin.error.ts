import { HttpException, HttpStatus } from '@nestjs/common';
// 图片格式错误
export class AdminCreateException extends HttpException {
    constructor(msg: string) {
        super(msg, HttpStatus.BAD_REQUEST);
    }
}

export class AdminUpadteException extends HttpException {
    constructor(msg: string) {
        super(msg, HttpStatus.BAD_REQUEST);
    }
}