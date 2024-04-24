import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordCloseException } from '../../error';


const SINGLE_TIME_CAP = 50;

@Injectable()
export class RecordService {

    constructor(
        private readonly prismaServer: PrismaService
    ) { }



    async getDayListByMonth(year: number, month: number) {
        const startDate = new Date(`${year}-${month}-01`);
        // 考虑年份进位
        const endDate = new Date(`${year + ((month + 1) > 12 ? 1 : 0)}-${month % 12 + 1}-01`);
        const oneDay = 1000 * 60 * 60 * 24;
        const days = (endDate.getTime() - startDate.getTime()) / oneDay;

        const dateList = [];
        for (let i = 0; i < days; i++) {
            const t_date = new Date(startDate.getTime() + oneDay * i);
            dateList.push(t_date.toISOString().slice(0, 10));
        }

        const res = await this.prismaServer.record.findMany({
            where: {
                date: {
                    in: dateList
                }
            },
        });
        const close_day = [];
        const full_day = [];
        const free_day = [];
        res.forEach(it => {
            if (it.close) {
                close_day.push(this.getDay(it.date));
            } else if (it.full) {
                full_day.push(this.getDay(it.date));
            } else {
                free_day.push(this.getDay(it.date));
            }
        });
        return {
            close_day,
            full_day,
            free_day
        };
    }

    // yyyy-mm-dd 获取dd
    getDay(date: string) {
        return parseInt(date.split('-')[2]);
    }


    // 根据日期 获取记录数据
    async getRecordByDate(date: string) {
        return {
            record: await this.prismaServer.record.findUnique({
                where: {
                    date: date
                },
                include: {
                    orders: {
                        include: {
                            orderItems: {
                                include: {
                                    guide: true
                                }
                            }
                        }
                    }
                }
            }),
        }
    }

}
