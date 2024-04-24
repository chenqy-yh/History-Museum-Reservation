import { HttpException } from "@nestjs/common";
import { HttpCode } from "../../utils/enum";

export class UserActionException extends HttpException {
    constructor(message: string) {
        super({
            cause: message,
        }, HttpCode.InValideUserAction)
    }
}