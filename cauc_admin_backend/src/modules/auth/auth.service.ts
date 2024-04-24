import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../admin/admin.service';

@Injectable()
export class AuthService {
    private readonly access_token_expire_time = process.env.ACCESS_TOKEN_EXPIRE_TIME;
    private readonly refresh_token_expire_time = process.env.REFRESH_TOKEN_EXPIRE_TIME;

    constructor(private readonly jwt: JwtService,
        private readonly userService: UserService
    ) { }


    // 登陆
    async login(user: any) {
        // 根据用户名查询用户
        const _user = await this.userService.findOne(user.username);
        if (!_user || _user.status === 1) {
            throw new ForbiddenException('user not found');
        }
        // 验证密码
        if (_user.password !== user.password) {
            throw new ForbiddenException('password error');
        } else {
            const access_token = this.token(user.username, this.access_token_expire_time);
            const refresh_token = this.token(user.username, this.refresh_token_expire_time);
            return await Promise.all([access_token, refresh_token]);
        }
    }
    

    // 刷新token
    async refreshToken(username: string) {
        return this.token(username, this.access_token_expire_time);
    }



    // 获取token
    async token(username: string, exprire: string = this.access_token_expire_time) {
        return {
            token: await this.jwt.signAsync({
                username: username
            }, {
                expiresIn: exprire
            })
        }
    }

    

}
