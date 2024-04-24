import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpCode } from '../../utils/enum';
// 指导员删除异常
export class GuideDeleteException extends HttpException {
    constructor(message: string) {
        super({
            message: message,
        }, HttpCode.GuideDelete)
    }
}