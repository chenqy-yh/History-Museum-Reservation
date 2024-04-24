import { Body, Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto } from '../../dto/login';
import { Auth } from '../../decorator/auth.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    //登陆
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        // 在这里进行登录逻辑，验证用户信息等
        try {
            const user = loginDto;
            const token_group = (await this.authService.login(user));
            const access_token = token_group[0].token;
            const refresh_token = token_group[1].token;
            // 设置 Access-Control-Expose-Headers : 'Key'
            // 用于前端获取自定义的响应头
            res.header('Access-Control-Expose-Headers', 'access-token,refresh-token,set-token');
            res.header('set-token', 'set-both')
            res.header('access-token', `Bearer ${access_token}`);
            res.header('refresh-token', `Bearer ${refresh_token}`);
            return res.status(200).json({
                message: 'Login successful',
            });
        } catch (error) {
            // console.log(error.message);
            Logger.error(`${loginDto.username} login fail, cause: ${error.message}`)
            return res.status(401).json({ message: 'Unauthorized' });

        }
    }


    @Post('refresh')
    @Auth()
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        // console.log(req.headers);
        try {
            const username = (req.user as any).username;

            const access_token = (await this.authService.refreshToken(username)).token;
            res.header('Access-Control-Expose-Headers', 'access-token,refresh-token,set-token');
            res.header('set-token', 'set-single')
            res.header('access-token', `Bearer ${access_token}`);
            return res.status(200).json({
                message: 'Refresh successful',
            });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // return 'ok';
    }


}
