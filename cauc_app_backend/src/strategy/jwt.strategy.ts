import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';


export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @Inject(PrismaService) private readonly prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(userPayload: any) {
        // 返回的值将被注入到request.user中
        const user = await this.prisma.user.findUnique({
            where: {
                openid: userPayload.openid
            },
        });
        return user;
    }
} 