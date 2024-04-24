import { Body, Controller, Get, ParseIntPipe, Post, Req } from '@nestjs/common';
import { UserService } from './admin.service';
import { Auth, IsSuper } from '../../decorator/auth.decorator';
import { Request } from 'express';
import { AdminCreateDto, AdminUpdateProfileDto, AdminUpdatePwdBySupperDto, checkValidOfAdminUpdateProfile } from '../../model/admin';

// @Controller('user')
@Controller('admin')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }



    @Get('selfinfo')
    @Auth()
    async getSelfInfo(@Req() req: Request) {
        const user = (req.user as any);
        return user;
    }

    @Post('addUser')
    @IsSuper()
    async addUser(@Req() req: Request, @Body() AdminCreateDto: AdminCreateDto) {
        const user = (req.user as any);
        return this.userService.createUser(AdminCreateDto, user.username);
    }

    @Get('getCommonUser')
    @IsSuper()
    async getCommonUser() {

        return this.userService.geCommontUserList();
    }

    @Post('updateAdminPwdBySuper')
    @IsSuper()
    async updateUserInfoBySuper(@Body('update_user_pwd') update_user_pwd: AdminUpdatePwdBySupperDto, @Body('user_id', ParseIntPipe) user_id: number) {
        return this.userService.updateAdminPwdBySuper(user_id, update_user_pwd);
        // console.log(update_user_pwd);
        // console.log(user_id);
        // return 'ok';
    }

    @Post('updateAdminProfileBySuper')
    @IsSuper()
    async updateAdminProfileBySuper(@Body('update_user_profile') update_user_profile: AdminUpdateProfileDto, @Body('user_id', ParseIntPipe) user_id: number) {
        return this.userService.updateAdminProfileBySuper(user_id, update_user_profile);
    }

    @Post('del')
    @IsSuper()
    async delUser(@Body('username') username: string) {
        return this.userService.delUser(username);
    };

}
