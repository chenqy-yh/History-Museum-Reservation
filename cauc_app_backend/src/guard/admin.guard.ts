import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const { user } = context.switchToHttp().getRequest();
        if (user?.username === 'admin' || user?.username === 'normal') {
            return true
        }
        throw new ForbiddenException('无权限');
    }
}