import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UserActionException } from "../error/user";

@Injectable()
export class IsBanGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const user: Prisma.UserCreateInput = context.switchToHttp().getRequest().user;
        if (user.status == 1) {
            throw new UserActionException('用户已被封禁');
        }
        return true;
    }
}