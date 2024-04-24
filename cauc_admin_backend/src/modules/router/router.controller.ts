import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Auth } from '../../decorator/auth.decorator';

@Controller('router')
export class RouterController {



    @Post('list')
    @Auth()
    async getRouter(@Req() req: Request) {
        const user = req['user'] as any;
        if (user.role === 'super') {
            return [{
                full_path_list: ['/userManager', '/guideManager', '/noticeManager'],
                p_node: 'Home',
                route: {
                    path: '/user',
                    name: 'User',
                    meta: {
                        auth: true,
                        title: '用户',
                        show: true,
                        icon: "ri-folder-user-line",
                        isTop: true
                    },
                    children: [
                        {
                            path: '/userManager',
                            name: 'UserManager',
                            meta: {
                                auth: true,
                                title: '用户管理',
                                show: true,
                            },
                            component_path: 'manager/user/userManager',
                        },
                        {
                            path: '/guideManager',
                            name: 'GuideManager',
                            meta: {
                                auth: true,
                                title: '引导员管理',
                                show: true,
                            },
                            component_path: 'manager/guide/guideManager',
                        },
                        {
                            path: '/noticeManager',
                            name: 'NoticeManager',
                            meta: {
                                auth: true,
                                title: '公告管理',
                                show: true,
                            },
                            component_path: 'manager/notice/noticeManager',
                        }
                    ],
                }
            }]
        }
    }

}
