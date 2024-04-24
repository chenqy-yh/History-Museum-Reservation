import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IsBanGuard } from "../guard/user-ban.guard";

export function Auth() {
    return applyDecorators(UseGuards(AuthGuard('jwt')))
}

export function NotBan() {
    return applyDecorators(UseGuards(AuthGuard('jwt'), IsBanGuard))
}