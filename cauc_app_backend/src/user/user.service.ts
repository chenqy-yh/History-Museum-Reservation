import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { OrderErrorStatusType } from '../utils/enum';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    // 创建用户
    async createUser(data: Prisma.UserCreateInput) {
        return await this.prismaService.user.create({
            data
        });
    }

    //根据openid查询用户
    async getUserByOpenid(openid: string) {
        return await this.prismaService.user.findUnique({
            where: {
                openid: openid
            }
        })
    }

    // 根据订单状态获取用户对应的订单的总数
    async getUserOrderCountByStatus(openid: string, status: number[]) {
        // return await this.prismaService.order.count({
        //     where: {
        //         openid: openid,
        //         status: {
        //             in: status
        //         }
        //     }
        // })
        throw new Error('未实现')
    }

    // 查询用户一个月内 取消和失约的总次数
    async getUserCancelTimes(openid: string) {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return await this.prismaService.order.count({
            where: {
                openid: openid,
                error_status: {
                    in: [OrderErrorStatusType.CANCEL, OrderErrorStatusType.MISS]
                },
                createAt: {
                    gte: date
                }
            }
        })
    }


    //封禁 user
    async banUser(openid: string) {
        return await this.prismaService.user.update({
            where: {
                openid: openid
            },
            data: {
                status: 1
            }
        })
    }

    //解封 user
    async unbanUser(openid: string) {
        return await this.prismaService.user.update({
            where: {
                openid: openid
            },
            data: {
                status: 0
            }
        })
    }

}
