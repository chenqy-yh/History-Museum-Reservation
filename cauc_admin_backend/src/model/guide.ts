import { IsNotEmpty, Length } from "class-validator";

export class GuideDto {

    id: number;

    @IsNotEmpty({
        message: '引导员姓名不能为空',
    })
    @Length(2, 10, {
        message: '引导员姓名长度为2-10个字符',
    })
    name: string;

    @IsNotEmpty({
        message: '引导员工号不能为空',
    })
    @Length(1, 16, {
        message: '引导员工号长度为1-16个字符',
    })
    staff_id: string;

    @IsNotEmpty({
        message: '引导员部门不能为空',
    })
    @Length(2, 16, {
        message: '引导员电话长度为1-16个字符',
    })
    group: string;


    @IsNotEmpty({
        message: '引导员电话不能为空',
    })
    @Length(11, 11, {
        message: '引导员电话长度为11个字符',
    })
    tel: string;


}