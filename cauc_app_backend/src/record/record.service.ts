import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordCloseException } from '../error';
import { Prisma, PrismaClient } from '@prisma/client';
import { RecordBookType } from '../utils/enum';


const SINGLE_TIME_CAP = 50;
const SINGLE_TIME_T_CAP = 3;

@Injectable()
export class RecordService {

    constructor(
        private readonly prismaServer: PrismaService
    ) { }
    //根据日期查询记录
    async getRecordByDate(date: string) {
        return await this.prismaServer.record.findUnique({
            where: {
                date: date,
            }
        });
    }

    // data: index < 6 ? `${8 + Math.floor(index / 2)}:${index % 2 ? '30' : '00'}` : `${13 + Math.floor((index - 6) / 2)}:${(index - 6) % 2 ? '30' : '00'}`,

    // 根据日期 时间查询剩余容量
    async getDayDetail(date: string) {
        const record = await this.prismaServer.record.findUnique({
            where: {
                date: date
            }
        });

        if (record === null || record.close) {
            throw new RecordCloseException();
        }

        const order_book_list = record.order_book_list.split(',').map(it => (it === RecordBookType.BOOK));
        let currentTime = 8 * 60 + 30; // 初始时间为上午8:30，以分钟为单位
        const startTimes = [];

        for (; currentTime <= 16 * 60;) {
            const isMorning = currentTime >= 8 * 60 + 30 && currentTime <= 11 * 60; // 判断是否在上午范围内
            const isAfternoon = currentTime >= 13.5 * 60 && currentTime <= 16 * 60; // 判断是否在下午范围内

            if (isMorning || isAfternoon) {
                const hour = Math.floor(currentTime / 60).toString().padStart(2, '0'); // 格式化为两位数的小时
                const minute = (currentTime % 60).toString().padStart(2, '0'); // 格式化为两位数的分钟
                startTimes.push(`${hour}:${minute}`);
            }

            currentTime += 30; // 每次递增30分钟
        }

        const res = {
            time_points: startTimes,
            time_frame_details: order_book_list.map((book_status, index) => ({
                order_date: date + ' ' + (startTimes[index] || ''),
                full: book_status,
                idx: index,
            })),
            has_guide: [(SINGLE_TIME_T_CAP - record.t_size_am) > 0, (SINGLE_TIME_T_CAP - record.t_size_pm) > 0],
        };
        return res;
    }



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
    //update record
    updateRecord(record: Prisma.RecordUpdateInput) {
        return this.prismaServer.record.update({
            where: {
                date: record.date as string
            },
            data: record
        })
    }

    // yyyy-mm-dd 获取dd
    getDay(date: string) {
        return parseInt(date.split('-')[2]);
    }



}
