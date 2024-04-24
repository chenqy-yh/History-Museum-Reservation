import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderItemService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    // 获取订单讲解员列表
    // type 0 完成 1 未完成 2 全部
    async getOrderItemListByGuideId(guide_id: number, type: 'finish' | 'unfinish' | 'all') {
        // // 校验type是否合法
        // if (type !== 'finish' && type !== 'unfinish' && type !== 'all') {
        //     throw new HttpException('type参数错误', HttpStatus.BAD_REQUEST);
        // }


        // const guide_condition: Prisma.OrderItemWhereInput = {
        //     guide: {
        //         id: guide_id
        //     }
        // }

        // const finish_type_condition: Prisma.OrderItemWhereInput = {
        //     order: {
        //         status: {
        //             in: getFinishOrderTypeList()
        //         }
        //     }
        // }

        // const unfinish_type_condition: Prisma.OrderItemWhereInput = {
        //     order: {
        //         status: {
        //             in: getUnfinishOrderTypeList()
        //         }
        //     }
        // }

        // if (type === 'finish') {
        //     return await this.prisma.orderItem.findMany({
        //         where: {
        //             AND: [
        //                 guide_condition,
        //                 finish_type_condition
        //             ]
        //         },
        //         include: {
        //             guide: true,
        //             order: true
        //         }
        //     })
        // } else if (type === 'unfinish') {
        //     return await this.prisma.orderItem.findMany({
        //         where: {
        //             AND: [
        //                 guide_condition,
        //                 unfinish_type_condition
        //             ]
        //         },
        //         include: {
        //             guide: true,
        //             order: true
        //         }
        //     })
        // } else if (type === 'all') {
        //     return await this.prisma.orderItem.findMany({
        //         where: guide_condition,
        //         include: {
        //             guide: true,
        //             order: true
        //         }
        //     })
        // }
        throw new Error('not implement')
    }

    // 为订单指派讲解员
    async assignGuide(order_item_id: number, guide_id: number) {
        const order_item_data = {
            guide: {
                connect: {
                    id: guide_id
                }
            }
        }
        return await this.prisma.orderItem.update({
            where: {
                id: order_item_id
            },
            data: order_item_data
        })
    }


    // 删除订单讲解员
    async removeGuide(order_item_id: number) {
        const order_item_data = {
            guide: {
                disconnect: true
            }
        }
        return await this.prisma.orderItem.update({
            where: {
                id: order_item_id
            },
            data: order_item_data
        })
    }




}
