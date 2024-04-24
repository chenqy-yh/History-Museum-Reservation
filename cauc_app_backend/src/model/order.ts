import { IsBoolean, IsNotEmpty, IsPhoneNumber, IsUrl } from 'class-validator';
import { IsInteger, IsValidOrgType, IsValidSizeList, IsValidSubPmType, IsValidTimeIdxList, IsValidTimeList } from '../validator/custom.validator';

//   {
//     permission_name: 'cqy',
//     permission_tel: '13333333333',
//     college: '空中交通管理学院',
//     org_type: 0,
//     size: '190',
//     tiem_list: [
//       '2023-10-25 08:30',
//       '2023-10-25 09:00',
//       '2023-10-25 09:30',
//       '2023-10-25 10:00'
//     ],
//     time_idx_list: [ 0, 1, 2, 3 ],
//     need: true,
//     sub_pm_type: 'IMG',
//     url: 'https://cauc-img-2-1300131488.cos.ap-beijing.myqcloud.com/784ca7a066f83b10461010a7107a10f7f4e9.webp',
//     openid: 'owUCH62NgdweQHBNYWa1ZNA3gtuQ'
//   }

export class OrderCreateDto {
    @IsNotEmpty({ message: '申请人姓名不能为空' })
    readonly permission_name: string;

    @IsNotEmpty({ message: '电话不能为空' })
    @IsPhoneNumber('CN', { message: '电话格式不合法' })
    readonly permission_tel: string;

    @IsNotEmpty({ message: '学院不能为空' })
    readonly organize: string;

    @IsNotEmpty({ message: '组织类型不能为空' })
    @IsValidOrgType('org_type', { message: '组织类型不合法' })
    readonly org_type: number;

    // @IsNotEmpty({ message: '人数不能为空' })
    // @IsInteger('size', { message: '人数必须为整数' })
    // readonly size: number;

    @IsNotEmpty({ message: '人数列表不能为空' })
    @IsValidSizeList('size_list', { message: '人数列表不合法' })
    readonly size_list: number[]

    @IsNotEmpty({ message: '时间列表不能为空' })
    @IsValidTimeList('time_list', { message: '时间列表不合法' })
    readonly time_list: string[];

    @IsNotEmpty({ message: '时间序列列表不能为空' })
    @IsValidTimeIdxList('time_idx_list', { message: '时间序列列表不合法' })
    readonly time_idx_list: number[];

    @IsNotEmpty({ message: '讲解员需求不能为空' })
    @IsBoolean({ message: '讲解员需求必须为布尔值' })
    readonly need: boolean;

    @IsNotEmpty({ message: '参观类型不能为空' })
    @IsValidSubPmType('sub_pm_type', { message: '参观类型不合法' })
    readonly sub_pm_type: string;

    @IsNotEmpty({ message: '许可证书资源地址不能为空' })
    @IsUrl({}, { message: '许可证书资源地址不合法' })
    readonly url: string;

    openid?: string;
}



export class Order {
    readonly id?: number;
    readonly college?: String;
    readonly pm_name?: String;
    readonly pm_tel?: number;
    readonly order_time?: Date;
    readonly size?: number;
    readonly need?: boolean;
    readonly status?: number;
    readonly sub_pm_type?: string;
    readonly verify_url?: String;
    readonly record_id?: number;
    readonly time_list?: string[];
    readonly time_idx_list?: number[];
}
