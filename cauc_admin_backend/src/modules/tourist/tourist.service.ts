import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TouristService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async getTouristList() {
        return await this.prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                orders: true,
            }
        })
    }

    async updateStatus({
        openid,
        status
    }) {
        if (openid === undefined) {
            return new HttpException('游客ID不合法', 400)
        }
        if (status === undefined) {
            return new HttpException('状态不合法', 400)
        }

        // 查询游客是否存在
        const tourist = await this.prisma.user.findUnique({
            where: {
                openid: openid
            },
            select: {
                id: true
            }
        })
        if (tourist === null) {
            return new HttpException('游客不存在', 400)
        }



        await this.prisma.user.update({
            where: {
                openid: openid
            },
            data: {
                status
            }
        })
        return '状态更新成功'
    }

}
