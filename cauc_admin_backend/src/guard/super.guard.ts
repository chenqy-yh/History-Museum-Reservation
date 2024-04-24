import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class SuperGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const { user } = context.switchToHttp().getRequest();
        if (user.role !== 'super') {
            throw new ForbiddenException('this user is not super');
        }
        return true;
    }
}