import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { Auth } from '../decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    // 根据订单状态获取用户对应的订单的总数
    @Get('cancelTimes')
    @Auth()
    async getUserOrderCountByStatus(@Req() req: Request) {
        const openid = (req.user as any).openid;
        const res = await this.userService.getUserCancelTimes(openid);
        console.log(res);
        return res;
    }


}
