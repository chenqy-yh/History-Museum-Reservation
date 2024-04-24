import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Auth } from '../decorator/auth.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    //登陆
    @Post('login')
    async login(@Body('code') code: string, @Res() res: Response) {
        // 在这里进行登录逻辑，验证用户信息等
        try {
            const login_info = (await this.authService.login(code));
            // 设置 Access-Control-Expose-Headers : 'Key'
            // 用于前端获取自定义的响应头
            res.header('Access-Control-Expose-Headers', 'authorization,token-max-age,username');
            res.header('authorization', `Bearer ${login_info.token}`);
            res.header('token-max-age', process.env.JWT_EXPIRES_IN);
            return res.status(200).json({
                message: 'Login successful',
                // 只保留 nickname 和avatar
                user: {
                    nickname: login_info.user.nickname,
                    avatar: login_info.user.avatar,
                    openid: login_info.user.openid
                }
            });
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });

        }
    }

    @Post('test')
    @Auth()
    async test(@Req() req: Request) {
        return '通过测试';
    }
}
