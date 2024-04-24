import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Auth, IsSuper } from '../../decorator/auth.decorator';
import { GuideService } from './guide.service';
import { GuideDto } from '../../model/guide';

@Controller('guide')
export class GuideController {

    constructor(
        private readonly guideService: GuideService
    ) { }

    @Post('update')
    @IsSuper()
    updateGuide(@Body() guideDto: GuideDto) {
        return this.guideService.updateGuide(guideDto)
    }


    @Get('list')
    @Auth()
    getGuideList() {
        return this.guideService.findAllGuide()
    }

    @Post('incGuideTime')
    @Auth()
    incGuideTime(@Body('guide_id') guide_id: number, @Body('order_id') order_id: number) {
        return this.guideService.incGuideTime(guide_id)
    }

    // 超级管理员权限
    @Post('add')
    @IsSuper()
    addGuide(@Body() guideDto: GuideDto) {
        return this.guideService.addGuide(guideDto)
    }

    // 超级管理员权限
    @Post('delete')
    @IsSuper()
    deleteGuide(@Body('guide_id') guide_id: number) {
        return this.guideService.deleteGuide(guide_id)
    }
}
