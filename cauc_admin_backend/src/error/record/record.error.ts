
import { HttpException, HttpStatus } from "@nestjs/common";
import { HttpCode } from "../../utils/enum";


// 日期不开放
export class RecordCloseException extends HttpException {
    constructor() {
        super('当日不开放', HttpCode.RecordClose);
    }
}
