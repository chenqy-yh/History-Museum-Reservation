import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidationException } from '../error';
import { HttpService } from '../http/http.service';
import { UserService } from '../user/user.service';
import { setUserLoginMap } from '../utils/store/user';

@Injectable()
export class AuthService {
    private readonly wx_login_url = 'https://api.weixin.qq.com/sns/jscode2session';

    constructor(private readonly jwt: JwtService,
        private readonly httpService: HttpService,
        private readonly userService: UserService
    ) { }

    async login(code: string) {
        try {
            const res = await this.httpService.get<WXLoginResponse>(this.wx_login_url, {
                params: {
                    appid: process.env.WX_APP_ID,
                    secret: process.env.WX_APP_SECRET,
                    js_code: code,
                    grant_type: 'authorization_code'
                }
            })
            const data = res.data;
            const openid = data.openid;
            let user = await this.userService.getUserByOpenid(openid)
            if (user == null) {
                console.log('创建用户');
                // 创建用户
                user = await this.userService.createUser({
                    openid: openid,
                    status: 0
                })
            }
            return {
                token: (await this.token(data)).token,
                user
            }
        } catch (error) {
            console.log(error);
            throw new ValidationException('登录失败');
        }

    }


    // 获取token
    async token(payload: any) {
        return {
            token: await this.jwt.signAsync(payload)
        }
    }

}
