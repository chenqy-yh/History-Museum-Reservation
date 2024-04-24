import { ExecutionContext, UseGuards, applyDecorators, createParamDecorator } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SuperGuard } from "../guard/super.guard";

export function Auth() {
    return applyDecorators(UseGuards(AuthGuard('jwt')))
}

// 验证是否是超级管理员
export function IsSuper() {
    return applyDecorators(UseGuards(AuthGuard('jwt'), SuperGuard))
}