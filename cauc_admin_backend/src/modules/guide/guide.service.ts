import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GuideDto } from 'src/model/guide';
import { GuideDeleteException } from '../../error/guide';
import { OrderItemService } from '../order-item/order-item.service';
import { PrismaService } from '../prisma/prisma.service';
import { GuideStatusEnum } from '../../utils/enum/guide';

@Injectable()
export class GuideService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly orderItemService: OrderItemService
    ) { }


    //查询所有的guide
    async findAllGuide() {
        return await this.prisma.guide.findMany({
            where: {
                status: GuideStatusEnum.NORMAL,
            }
        })
    }


    //添加guide
    async addGuide(guide: GuideDto) {
        const guideData: Prisma.GuideCreateInput = {
            name: guide.name,
            staff_id: guide.staff_id,
            group: guide.group,
            tel: guide.tel,
        }
        return await this.prisma.guide.create({
            data: guideData,
        });
    }


    //更新guide
    async updateGuide(guide: GuideDto) {
        const guideData: Prisma.GuideUpdateInput = {
            name: guide.name,
            staff_id: guide.staff_id,
            group: guide.group,
            tel: guide.tel,
        }

        return await this.prisma.guide.update({
            where: {
                id: guide.id
            },
            data: guideData
        })
    }

    //删除guide
    async deleteGuide(guide_id: number) {
        // console.log('guide_id:', guide_id);
        // //判断是否有订单
        // const order = await this.orderItemService.getOrderItemListByGuideId(guide_id, "unfinish");
        // if (order.length > 0) {
        //     throw new GuideDeleteException("该讲解员有未完成订单，不能删除");
        // }
        // return await this.prisma.guide.update({
        //     where: {
        //         id: guide_id
        //     },
        //     data: {
        //         status: GuideStatusEnum.DISABLE
        //     }
        // })
        throw new Error('not implement')
    }

    // inc time
    async incGuideTime(guide_id: number) {
        return await this.prisma.guide.update({
            where: {
                id: guide_id
            },
            data: {
                guide_time: {
                    increment: 1
                }
            }
        })
    }


}
