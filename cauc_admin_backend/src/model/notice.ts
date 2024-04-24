import { IsNotEmpty, IsNumber } from "class-validator";
import { IsValidDelay, IsValidType } from "src/validator/notice.validator";

export class NoticeDto {
    @IsNotEmpty({
        message: '标题不能为空'
    })
    title: string;
    // 不小于1000
    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
    }, {
        message: '延迟时间必须为整数'
    })
    @IsValidDelay('delay', {
        message: '延迟时间必须大于1000'
    })
    delay: number;
    @IsNotEmpty({
        message: '内容不能为空'
    })
    @IsValidType('type', {
        message: '类型不合法'
    })
    type: string;
}