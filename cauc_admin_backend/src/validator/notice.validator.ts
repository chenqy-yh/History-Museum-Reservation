import { validatorFactory } from './base'

const type_list = ['info', 'warning', 'error', 'success'];

// 验证延迟是否合法  大于1000 且为整数
export const IsValidDelay = validatorFactory('isValidDelay', (val: number) => {
    return val >= 1000 && Number.isInteger(val);
});

// 验证类型是否合法
export const IsValidType = validatorFactory('isValidType', (val: string) => {
    return type_list.includes(val);
});