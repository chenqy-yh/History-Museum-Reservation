import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AdminCreateDto, AdminUpdateProfileDto, AdminUpdatePwdBySupperDto, checkValidOfAdminUpdateProfile } from '../../model/admin';
import { AdminCreateException, AdminUpadteException } from '../../error/admin';


@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ) { }


    //   {
    //     username: 'a1140710816',
    //     password: 'yinhan123',
    //     confirm_password: 'yinhan123',
    //     nickname: 'chen',
    //     tel: '13333333333',
    //     mail: 'maii@qq.com',
    //     sex: 0,
    //     status: 0,
    //     remark: 'test'
    //   }

    async createUser(AdminCreateDto: AdminCreateDto, f_admin_username: string) {
        const userData: Prisma.AdminCreateInput = {
            username: AdminCreateDto.username,
            password: AdminCreateDto.password,
            nickname: AdminCreateDto.nickname,
            tel: AdminCreateDto.tel,
            mail: AdminCreateDto.mail,
            role: 'common',
            sex: AdminCreateDto.sex,
            status: AdminCreateDto.status,
            f_admin: {
                connect: {
                    username: f_admin_username
                }
            }
        }
        console.log(userData);
        // 判断用户名是否已经存在
        if (await this.checkTelIsAlreadyExist(userData.tel)) {
            throw new HttpException('手机号已经存在', HttpStatus.BAD_REQUEST);
        }

        // 判断邮箱是否已经存在
        if (await this.checkMailIsAlreadyExist(userData.mail)) {
            throw new HttpException('邮箱已经存在', HttpStatus.BAD_REQUEST);
        }

        try {

            const res = await this.prisma.admin.create({
                data: userData,
            })
            return res;
        } catch (error) {
            console.log(error);
            throw new AdminCreateException('创建用户失败')
        }
    }


    // 根据username查询用户
    async findOne(username: string) {
        return await this.prisma.admin.findUnique({
            where: {
                username: username
            },

        })
    }

    // 获取 普通管理员 列表
    async geCommontUserList() {
        // 去除密码信息
        return await this.prisma.admin.findMany({
            where: {
                role: 'common',
                status: 0
            },
            select: {
                avatar: true,
                createdAt: true,
                f_admin: {
                    select: {
                        username: true,
                        nickname: true
                    }
                },
                id: true,
                mail: true,
                nickname: true,
                role: true,
                sex: true,
                status: true,
                tel: true,
                updatedAt: true,
                username: true

            }
        })
    }

    // 超级管理员 更新用户密码 
    async updateAdminPwdBySuper(user_id: number, AdminCreateDto: AdminUpdatePwdBySupperDto,) {

        return await this.prisma.admin.update({
            where: {
                id: user_id
            },
            data: {
                password: AdminCreateDto.new_password
            }
        });
    }



    // 超级管理员 更新用户信息
    async updateAdminProfileBySuper(user_id: number, adminUpdateDto: AdminUpdateProfileDto,) {
        const valid = checkValidOfAdminUpdateProfile(adminUpdateDto);
        if (!valid) {
            throw new AdminUpadteException('对象非法');
        }
        try {
            return await this.prisma.admin.update({
                where: {
                    id: user_id
                },
                data: adminUpdateDto
            });
        } catch (error) {
            console.log(error);
            throw new AdminUpadteException(error);
        }
    }

    async delUser(username: string) {
        const res = await this.prisma.admin.update({
            where: {
                username: username
            },
            data: {
                status: 1
            }
        })
        return
    }


    // 检查手机号是否已经存在
    async checkTelIsAlreadyExist(tel: string) {
        return await this.prisma.admin.findUnique({
            where: {
                tel: tel
            }
        })
    }

    // 检查邮箱是否已经存在
    async checkMailIsAlreadyExist(mail: string) {
        return await this.prisma.admin.findUnique({
            where: {
                mail: mail
            }
        })
    }

}
