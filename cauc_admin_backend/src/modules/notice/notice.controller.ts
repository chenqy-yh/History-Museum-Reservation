import { Body, Controller, Get, Post } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Auth, IsSuper } from '../../decorator/auth.decorator';
import { NoticeDto } from '../../model/notice';

@Controller('notice')
export class NoticeController {
    constructor(
        private readonly noticeService: NoticeService
    ) { }

    // 设置公告列表
    @Post('save')
    @IsSuper()
    async saveNoticeList(@Body('notice_list') notice_list: NoticeDto[]) {
        return await this.noticeService.setNoticeList(notice_list);
    }

    // 获得公告列表
    @Get('list')
    @Auth()
    async getNoticeList() {
        return await this.noticeService.getNoticeList();
    }


}
