import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {

    constructor(
        private readonly recordService: RecordService
    ) { }

    @Get('daycap')
    async getCapByDate(@Query('date') date: string) {
        const res = await this.recordService.getDayDetail(date);
        return res;
    }


    // yms 2023-09,2023-10,2023-11,2023-12,2024-01
    @Get('daylist')
    async getCapListByMonth(@Query('yms') yms: string) {
        const ymlist = yms.split(',').map(it => {
            const [y, m] = it.split('-');
            return {
                y: parseInt(y),
                m: parseInt(m)
            }
        });
        const res = [];
        for (let ym of ymlist) {
            res.push({
                y: ym.y,
                m: ym.m,
                detail: await this.recordService.getDayListByMonth(ym.y, ym.m)
            })
        }
        return res;
    }



}
