import { Body, Controller, Get, Post } from '@nestjs/common';
import { TouristService } from './tourist.service';
import { Auth } from '../../decorator/auth.decorator';

@Controller('tourist')
export class TouristController {

    constructor(
        private readonly touristService: TouristService
    ) { }

    @Get('getTouristList')
    @Auth()
    async getTouristList() {
        return await this.touristService.getTouristList();
    }


    @Post('update/status')
    @Auth()
    async updateStatus(@Body('openid') openid: string, @Body('status') status: number) {
        return await this.touristService.updateStatus({
            openid,
            status
        });
    }

}
