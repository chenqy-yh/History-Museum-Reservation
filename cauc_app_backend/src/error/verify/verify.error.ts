import { HttpException, HttpStatus } from "@nestjs/common";
import { HttpCode } from "../../utils/enum";

export class ValidationException extends HttpException {
    constructor(message: string) {
        super({
            message: message,
            status: HttpStatus.BAD_REQUEST,
        }, HttpCode.Validation)
    }
}