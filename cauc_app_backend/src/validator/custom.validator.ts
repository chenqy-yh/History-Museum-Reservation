import { ValidationOptions, registerDecorator, ValidationArguments } from "class-validator";
import { PermissonType } from '../utils/enum/order'
import { SINGLE_EVENT_MAX_CAP, TIME_LIST } from "../utils/config/order";

function validatorFactory(validator_name: string, validate_fn: (val: any) => boolean) {
    return function (property: string, validationOptions?: ValidationOptions) {
        return function (object: Object, propertyName: string) {
            registerDecorator({
                name: validator_name,
                target: object.constructor,
                propertyName: propertyName,
                options: validationOptions,
                validator: {
                    validate(value: any, args: ValidationArguments) {
                        const val = (args.object as any)[property];
                        return validate_fn(val);
                    },
                },
            });
        };
    };
}


// 验证是否为有效的组织类型 0 校内组织 1 校外组织
export const IsValidOrgType = validatorFactory('isValidOrgType', (val: any) => {
    return val === 0 || val === 1;
});

//判断是否是正整数
export const IsInteger = validatorFactory('isValidSize', (val: any) => {
    const regPos = /^\d+$/;
    return regPos.test(val);
});

export const IsValidSizeList = validatorFactory('isValidSizeList', (val: number[]) => {
    return !val.some((item) => {
        return item < 0 || item > SINGLE_EVENT_MAX_CAP;
    });
});

//判断时间列表是否是合法的
export const IsValidTimeList = validatorFactory('isValidTimeList', (time_list: string[]) => {
    try {
        const check_res = time_list.some((item, idx) => {
            const cur_time = new Date(item);
            //获得 hh:mm 不足两位补0
            const hh = cur_time.getHours().toString().padStart(2, '0');
            const mm = cur_time.getMinutes().toString().padStart(2, '0');
            const cur_time_str = `${hh}:${mm}`;
            const idx_in_time_list = TIME_LIST.indexOf(cur_time_str);
            if (idx_in_time_list === -1) {
                return true;
            }
            // 获得时间戳
            const cur_time_stamp = cur_time.getTime();
            if (idx !== 0) {
                // 两个时间戳相差30分钟
                if (cur_time_stamp - (new Date(time_list[idx - 1]).getTime()) !== 30 * 60 * 1000) {
                    return true;
                }
            }
        });
        return !check_res;
    } catch (error) {
        console.log('IsValidTimeList', error);
        return false;
    }
});

//判断时间序列列表是否是合法的
// time_list: [ '2023-10-27 08:30', '2023-10-27 09:00', '2023-10-27 09:30' ],
export const IsValidTimeIdxList = validatorFactory('isValidTimeIdxList', (time_idx_list: number[]) => {
    return !time_idx_list.some((it, idx) => {
        return (idx > 0 && it - time_idx_list[idx - 1] !== 1) || it < 0;
    })
});

// 判断许可证书类型是否合法
//0 IMG 1 PDF
export const IsValidSubPmType = validatorFactory('isValidSubPmType', (val: any) => {
    return val === PermissonType.IMG || val === PermissonType.PDF;
});