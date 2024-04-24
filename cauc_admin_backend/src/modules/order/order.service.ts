import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OperateStatusType, OrderErrorStatusType, OrderStatusType } from 'src/utils/enum';

export type OrderTypeForGuide = 'all' | 'finish' | 'unfinish';

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) { }


    // 获取订单总数 根据createAt
    async getOrderCountByCreateAt(createAt: string) {
        // createAt 2023-10-19 范围是当天的0点到24点
        const gte = new Date(createAt + ' 00:00:00');
        const lt = new Date(createAt + ' 23:59:59');
        return await this.prisma.order.count({
            where: {
                createAt: {
                    gte: gte,
                    lt: lt
                },
            }
        })
    }

    // 获取订单总数 根据order_date
    async getOrderCountByDate(date: string) {
        return await this.prisma.order.count({
            where: {
                order_date: date,
            }
        })
    }

    // 分页查询订单
    async findOrder({
        page = 0,
        size = 0,
        operate_status_list = [],
        order_status_list = [],
        error_status_list = [],
        date_list = [],
        guide_assign = 0,
    } = {}) {

        console.log('date_list:', date_list)

        const where: Prisma.OrderWhereInput = {
            operate_status: {
                in: operate_status_list,
            },
            order_status: {
                in: order_status_list,
            },
            error_status: {
                in: error_status_list,
            }
        }
        if (date_list.length > 0) {
            where.order_date = {
                in: date_list
            }
        }

        if (guide_assign) {
            // 1 未分配 2 已分配
            switch (guide_assign) {
                case 1:
                    where.orderItems = {
                        some: {
                            guide_id: {
                                equals: null
                            }
                        }
                    }
                    break;
                case 2:
                    where.orderItems = {
                        some: {
                            guide_id: {
                                not: null
                            }
                        }
                    }
                    break;
            }

        }

        const res = await this.prisma.order.findMany({
            where: where,
            skip: (page - 1) * size,
            take: size,
            include: {
                orderItems: {
                    include: {
                        guide: true
                    }
                }
            }
        })
        console.log(res.length);
        return res;
    }

    // 获取订单总数
    async getOrderCount(
        {
            operate_status_list = [],
            order_status_list = [],
            error_status_list = [],
            date_list = [],
            guide_assign = 0,
        }
    ) {
        const where: Prisma.OrderWhereInput = {
            operate_status:
            {
                in: operate_status_list
            },
            order_status:
            {
                in: order_status_list
            },
            error_status:
            {
                in: error_status_list
            }
        }
        if (date_list.length > 0) {
            where.order_date = {
                in: date_list
            }
        }
        if (guide_assign) {
            // 1 未分配 2 已分配
            switch (guide_assign) {
                case 1:
                    where.orderItems = {
                        some: {
                            guide_id: {
                                equals: null
                            }
                        }
                    }
                    break;
                case 2:
                    where.orderItems = {
                        some: {
                            guide_id: {
                                not: null
                            }
                        }
                    }
                    break;
            }

        }
        return await this.prisma.order.count({
            where: where
        })
    }


    // 更改订单操作状态
    async changeOrderOperateStatusById({
        order_id,
        operate_status
    }: {
        order_id: number,
        operate_status: number
    }) {
        // 查询订单当前状态
        const order = await this.prisma.order.findUnique({
            where: {
                id: order_id
            },
            select: {
                operate_status: true
            }
        })
        if (order.operate_status !== OperateStatusType.UNSOLVE) {
            throw new HttpException('订单已经被处理', HttpStatus.BAD_REQUEST);
        }
        return await this.prisma.order.update({
            where: {
                id: order_id
            },
            data: {
                operate_status: operate_status
            }
        })
    }

    // 更改订单状态
    async changeOrderStatusById({
        order_id, order_status
    }: {
        order_id: number,
        order_status: number
    }) {
        const order = await this.prisma.order.findUnique({
            where: {
                id: order_id
            },
            select: {
                order_status: true
            }
        })
        if (order.order_status !== OrderStatusType.UNFINISH) {
            throw new HttpException('订单已经被处理', HttpStatus.BAD_REQUEST);
        }
        return await this.prisma.order.update({
            where: {
                id: order_id
            },
            data: {
                order_status: order_status
            }
        })
    }


    // 更改订单异常状态
    async changeOrderErrorStatusById({
        order_id, order_error_status
    }: {
        order_id: number,
        order_error_status: number
    }) {
        // 查询订单异常状态
        const order = await this.prisma.order.findUnique({
            where: {
                id: order_id
            },
            select: {
                error_status: true
            }
        })
        if (order.error_status !== OrderErrorStatusType.NONE) {
            throw new HttpException('订单异常状态已经被处理', HttpStatus.BAD_REQUEST);
        }

        return await this.prisma.order.update({
            where: {
                id: order_id
            },
            data: {
                error_status: order_error_status
            }
        })
    }


    // print excel
    // 根据day_list 查询订单
    async findOrderByDateList(date_list: string[]) {
        return await this.prisma.order.findMany({
            where: {
                order_date: {
                    in: date_list
                }
            },
            include: {
                orderItems: {
                    include: {
                        guide: true
                    }
                }

            }
        })
    }

    // 根据month_list 查询订单
    async findOrderByMonthList(month_list: string[]) {
        if (month_list.length === 0)
            return [];
        const query_list: Prisma.OrderWhereInput[] = [];
        const query: Prisma.OrderWhereInput = {
            order_date: {
                startsWith: month_list[0]
            }
        }
        query_list.push(query);
        if (month_list.length > 1) {
            month_list.slice(1).forEach((month) => {
                query_list.push({
                    order_date: {
                        startsWith: month
                    }
                })
            })
        }
        // 开始查询
        return await this.prisma.order.findMany({
            where: {
                OR: query_list
            },
            include: {
                orderItems: {
                    include: {
                        guide: true
                    }
                }

            }
        })
    }

    // 根据year_list 查询订单
    async findOrderByYearList(year_list: string[]) {
        if (year_list.length === 0)
            return [];
        const query_list: Prisma.OrderWhereInput[] = [];
        const query: Prisma.OrderWhereInput = {
            order_date: {
                startsWith: year_list[0]
            }
        }
        query_list.push(query);
        if (year_list.length > 1) {
            year_list.slice(1).forEach((year) => {
                query_list.push({
                    order_date: {
                        startsWith: year
                    }
                })
            })
        }
        // 开始查询
        return await this.prisma.order.findMany({
            where: {
                OR: query_list
            },
            include: {
                orderItems: {
                    include: {
                        guide: true
                    }
                }

            }
        })
    }

    // ---------------- utils ------------------
    // 根据date 返回 timeList  包括12个时间点
    getTimeList(date: string) {
        //date 2023-10-19
        let timeList = [];
        let time = new Date(date + ' 08:30');
        //获取时间搓
        let timestamp = time.getTime();
        for (let i = 0; i < 12; i++) {
            timeList.push(new Date(timestamp + i * 30 * 60 * 1000));
            if (i === 5) {
                //中午休息
                timestamp = timestamp + 120 * 60 * 1000;
            }
        }
        return timeList;
    };

}
