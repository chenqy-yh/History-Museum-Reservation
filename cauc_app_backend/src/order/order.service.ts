import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderCreateDto } from 'src/model/order';
import { OperateStatusType, OrderErrorStatusType, OrderStatusType, RecordBookType } from '../utils/enum';
import { OrderCancelException, OrderCreateException, OrderNotExistException } from '../error';
import { PrismaService } from '../prisma/prisma.service';
import { RecordService } from '../record/record.service';
import { UserService } from '../user/user.service';
import { TIME_LIST, USER_CANCEL_MAX_TIME } from '../utils/config/order';
import { orderErrorStatusTypeToCancel, orderErrorStatusTypeToMiss } from './utils/status';
@Injectable()
export class OrderService {
    private readonly max_t_cap = 3;

    constructor(private readonly prisma: PrismaService,
        private readonly recordService: RecordService,
        private readonly userService: UserService
    ) { }



    // API function
    // 根据用户id查询订单
    async queryOrderByOpenid(openid: string) {
        return await this.prisma.order.findMany({
            where: {
                openid: openid
            },
            include: {
                orderItems: true
            }
        })
    }

    // 根据时间点获得人数余量
    getRemainCapByTimeCap(time_cap: string, st: number, ed: number) {
        return time_cap.split(',').reduce((pre, cur, index) => {
            if (index >= st && index < ed) {
                return pre;
            }
            return pre + parseInt(cur);
        })
    }




    //创建订单
    //   {
    //     permission_name: 'cqy',
    //     permission_tel: '13333333333',
    //     organize: '交通科学与工程学院',
    //     org_type: 0,
    //     size_list: [ 44, 34, 33 ],
    //     time_list: [ '2023-10-27 08:30', '2023-10-27 09:00', '2023-10-27 09:30' ],
    //     time_idx_list: [ 0, 1, 2 ],
    //     need: true,
    //     sub_pm_type: 'IMG',
    //     url: 'https://cauc-img-2-1300131488.cos.ap-beijing.myqcloud.com/76b439a96f02063ad762410fb6cf07dcf.jpg',
    //     openid: 'owUCH62NgdweQHBNYWa1ZNA3gtuQ'
    //   }

    // RECORD
    //   {
    //     id: 57,
    //     createAt: 2023-10-22T14:32:50.256Z,
    //     updateAt: 2023-10-22T14:32:50.256Z,
    //     date: '2023-10-27',
    //     t_size_am: 0,
    //     t_size_pm: 0,
    //     order_size_list: '0,0,0,0,0,0,0,0,0,0,0,0',
    //     order_book_list: 'false,false,false,false,false,false,false,false,false,false,false,false',
    //     full: false,
    //     close: false
    //   }

    async createOrder(data: OrderCreateDto) {
        // 检测 订单日期是否开放
        const order_date = data.time_list[0].split(' ')[0];
        const ampm = TIME_LIST.indexOf(data.time_list[0].split(' ')[1]) < 6 ? 0 : 1;
        const record = await this.recordService.getRecordByDate(order_date);
        const old_record = Object.assign({}, record);
        if (!this.checkOpen(record)) {
            throw new OrderCreateException('订单日期不开放');
        }
        // 检测 是否满
        if (record.full) {
            throw new OrderCreateException('当日订单已满');
        }
        // 检测 组织类型为0时  组织名称是否合法 TODO
        // 检测 当日是否存在可分配解说员
        if ((ampm === 0 && record.t_size_am === this.max_t_cap) || (ampm === 1 && record.t_size_pm === this.max_t_cap)) {
            throw new OrderCreateException('当日解说员已满');
        }

        //检测 订单预订时段是否冲突
        const time_conflict = data.time_idx_list.some((item) => {
            return !this.checkTimeIsFree(record, item);
        });
        if (time_conflict) {
            throw new OrderCreateException('订单预订时段冲突');
        }

        // 修改record t_size
        if (ampm === 0) {
            record.t_size_am += 1;
        }
        else {
            record.t_size_pm += 1;
        }
        // 修改order_size and order_book
        let full = false;
        const order_size_list = record.order_size_list.split(',');
        const order_book_list = record.order_book_list.split(',');
        data.time_idx_list.forEach((item, idx) => {
            order_size_list[item] = (parseInt(order_size_list[item]) + data.size_list[idx]).toString();
            order_book_list[item] = RecordBookType.BOOK;
            full &&= order_book_list[item] === '1';
        });
        // 修改record full
        record.full = full;
        // 修改record order_size_list
        record.order_size_list = order_size_list.join(',');
        // 修改record order_book_list
        record.order_book_list = order_book_list.join(',');
        let order_id = -1;
        try { // 修改 record 创建 order
            const transations_1 = await this.prisma.$transaction([
                this.prisma.record.update({
                    where: {
                        id: record.id
                    },
                    data: {
                        t_size_am: record.t_size_am,
                        t_size_pm: record.t_size_pm,
                        full: record.full,
                        order_size_list: record.order_size_list,
                        order_book_list: record.order_book_list
                    }
                }),
                this.prisma.order.create({
                    data: {
                        pm_name: data.permission_name,
                        pm_tel: data.permission_tel,
                        organize: data.organize,
                        org_type: data.org_type,
                        need: data.need,
                        sub_pm_type: data.sub_pm_type,
                        verify_url: data.url,
                        openid: data.openid,
                        recordId: record.id,
                        order_date: order_date,
                        operate_status: OperateStatusType.UNSOLVE,
                        order_status: OrderStatusType.UNFINISH,
                        error_status: OrderErrorStatusType.NONE,
                    },
                }),
            ]);
            // 创建订单成功，返回订单号
            order_id = transations_1[1].id;
            // 创建orderItem
            await this.prisma.$transaction(data.time_idx_list.map((item, idx) => {
                return this.prisma.orderItem.create({
                    data: {
                        orderId: order_id,
                        size: data.size_list[idx],
                        order_date: order_date,
                        order_time_idx: item,
                        order_time: new Date(data.time_list[idx]),
                        openid: data.openid,
                    }
                })
            }));
            return transations_1[1];
        } catch (error) {
            console.log(error);
            // 回滚
            await this.prisma.$transaction([
                this.prisma.record.update({
                    where: {
                        id: record.id
                    },
                    data: {
                        t_size_am: old_record.t_size_am,
                        t_size_pm: old_record.t_size_pm,
                        full: old_record.full,
                        order_size_list: old_record.order_size_list,
                        order_book_list: old_record.order_book_list
                    }
                }),
                this.prisma.order.delete({
                    where: {
                        id: order_id,
                    }
                })
            ]);
            throw new OrderCreateException('创建订单失败');
        }
    }


    // 取消订单
    async cancelOrder(order_id: number, openid: string) {
        // 根据openid 进30天内取消订单的次数
        let cancel_times = await this.userService.getUserCancelTimes(openid);

        if (cancel_times >= USER_CANCEL_MAX_TIME) {
            console.log('取消订单次数过多');
            throw new HttpException('取消订单次数过多', HttpStatus.BAD_REQUEST);
        }

        cancel_times += 1;

        // 检测订单是否存在
        const order = await this.prisma.order.findUnique({
            where: {
                id: order_id
            },
            include: {
                orderItems: true
            }
        });
        if (order === null) {
            console.log('订单不存在')
            throw new HttpException('订单不存在', HttpStatus.BAD_REQUEST);
        }

        // 检测订单是否处于已经处理的状态
        if (order.operate_status !== OperateStatusType.UNSOLVE) {
            console.log('订单不可取消');
            throw new HttpException("订单不可取消", HttpStatus.BAD_REQUEST);
        }

        // 检测订单是否处于可取消时间段
        // 订单创建之内一天
        const cancel_order_last_time = new Date(order.createAt.getTime() + 24 * 3600 * 1000);
        // const cancel_order_last_time = new Date(order.createAt.getTime() + 1 * 1000);

        if (new Date() > cancel_order_last_time) {
            // 修改订单状态为失约
            orderErrorStatusTypeToMiss(order);
        } else {
            // 修改订单状态为取消
            orderErrorStatusTypeToCancel(order);
        }
        // 修改record
        const record = await this.prisma.record.findUnique({
            where: {
                id: order.recordId
            }
        });

        // 修改record t_size
        if (order.need) {
            const ampm = TIME_LIST.indexOf(order.orderItems[0].order_time.toLocaleTimeString().split(' ')[0]) < 6 ? 0 : 1;
            if (ampm === 0) {
                record.t_size_am -= 1;
            }
            else {
                record.t_size_pm -= 1;
            }
        }

        // 修改record full
        record.full = false;

        // 修改record order_size_list
        const order_size_list = record.order_size_list.split(',');
        const order_book_list = record.order_book_list.split(',');
        order.orderItems.forEach((item) => {
            order_size_list[item.order_time_idx] = '0';
            order_book_list[item.order_time_idx] = RecordBookType.UNBOOK;
        });

        record.order_size_list = order_size_list.join(',');
        record.order_book_list = order_book_list.join(',');

        // 创建transaction
        try {
            const transactions = await this.prisma.$transaction([
                this.prisma.record.update({
                    where: {
                        id: record.id
                    },
                    data: {
                        t_size_am: record.t_size_am,
                        t_size_pm: record.t_size_pm,
                        full: record.full,
                        order_size_list: record.order_size_list,
                        order_book_list: record.order_book_list
                    }
                }),
                this.prisma.order.update({
                    where: {
                        id: order.id
                    },
                    data: {
                        operate_status: order.operate_status,
                        order_status: order.order_status,
                        error_status: order.error_status,
                    }
                }),
                // //逻辑删除orderItem 修改status 为1
                this.prisma.orderItem.updateMany({
                    where: {
                        orderId: order.id
                    },
                    data: {
                        status: 1
                    }
                }),
                this.prisma.user.update({
                    where: {
                        openid: openid
                    },
                    data: {
                        status: cancel_times >= USER_CANCEL_MAX_TIME ? 1 : 0
                    }
                })
            ]);
            return transactions[1];
        } catch (error) {
            console.log(error);
            throw new HttpException('取消订单失败', HttpStatus.BAD_REQUEST);
        }
    }


    //更新order
    updateOrderStatus(order_id: number, status: number) {
        // return this.prisma.order.update({
        //     where: {
        //         id: order_id
        //     },
        //     data: {
        //         status: status
        //     }
        // })
        throw new Error('未实现')
    }

    // utils function
    // 检测是否开放
    checkOpen(record: Prisma.RecordCreateInput) {
        if (record === null || record.close === true) {
            return false;
        }
        return true;
    }

    // 检测对应时间段是否已经存在订单
    checkTimeIsFree(record: Prisma.RecordCreateInput, time_idx: number) {
        if (record.order_book_list.split(',')[time_idx] === '1') {
            return false;
        }
        return true;
    }

    // 检测是否有教师余量
    checkTeacherCap(record: Prisma.RecordCreateInput, t_flag: number) {
        if (
            (t_flag === 0 && record.t_size_am === this.max_t_cap) ||
            (t_flag === 1 && record.t_size_pm === this.max_t_cap)
        ) {
            return false;
        }
        return true;
    }




}
