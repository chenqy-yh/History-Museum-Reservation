import { Controller, Get, Query } from '@nestjs/common';

const fr_day = {
    9: {
        close_day: [2, 9, 16, 23, 30, 3, 10, 17, 24],
        free_day: [1, 8, 15, 22, 12, 13, 20, 27, 7, 14, 28]
    },
    10: {
        close_day: [7, 14, 21, 28, 1, 8, 15, 22, 29],
        free_day: [6, 13, 20, 27, 5, 12, 19, 26, 4, 11, 18, 25]
    },
    11: {
        close_day: [4, 11, 18, 25, 5, 12, 19, 26],
        free_day: [3, 10, 17, 24, 1, 8, 15, 22, 29, 7, 14, 21, 28]
    }
}

@Controller('date')
export class DateController {
    @Get('getfreeday')
    queryFreeDay(@Query('ms') months: string) {
        // ms = 9,10,11
        const m_list = months.split(',');
        const res = [];
        for (let m of m_list) {
            res.push({
                m: m,
                detail: fr_day[m]
            })
        }
        return res;
    }
}