import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NoticeDto } from 'src/model/notice';

@Injectable()
export class NoticeService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async setNoticeList(notice_list: NoticeDto[]) {
        console.log('notice_list:', notice_list);

        // 清空notice表
        const del_all = this.prisma.notice.deleteMany();
        // 插入notice表
        const insert_all = this.prisma.notice.createMany({
            data: notice_list
        });
        // 依次执行
        const tasks = await this.prisma.$transaction([del_all, insert_all]);
        return 'ok';
    }

    async getNoticeList() {
        return await this.prisma.notice.findMany();
    }

}
