import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { validatorFactory } from './base';


// 验证用户名是否合法
export const IsValidUsername = validatorFactory('isValidUsername', (val: any) => {
    // 以字母开头 字母数字组合  8-16位
    const reg = /^[a-zA-Z][a-zA-Z0-9]{7,15}$/;
    return reg.test(val);
});

// 验证密码是否合法
export const IsValidPassword = validatorFactory('isValidPassword', (val: any) => {
    // 以字母开头 字母数字组合  8-16位
    const reg = /^[a-zA-Z][a-zA-Z0-9]{7,15}$/;
    return reg.test(val);
});

export const IsValidConfirmPsw = (pwd_prop, confirm_pwd_prop: string, validationOptions?: ValidationOptions,
) => {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidConfirmPsw',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    // 获取密码和确认密码
                    const password = (args.object as any)[pwd_prop];
                    const confirm_password = (args.object as any)['confirm_password'];
                    return password === confirm_password;
                },
            },
        });
    };
}

export const IsValidNickName = validatorFactory('isValidNickName', (val: any) => {
    // 字母 数字 汉字组合 2-16位
    const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,16}$/;
    return reg.test(val);
});

export const IsValidTel = validatorFactory('isValidTel', (val: any) => {
    // 验证手机号
    const reg = /^1[3456789]\d{9}$/;
    return reg.test(val);
});


export const IsValidMail = validatorFactory('isValidMail', (val: any) => {
    // 验证邮箱
    const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    return reg.test(val);
});

export const IsValidSex = validatorFactory('isValidSex', (val: any) => {
    // 验证性别
    return val === 0 || val === 1;
});

export const IsValidStatus = validatorFactory('isValidStatus', (val: any) => {
    // 验证状态
    return val === 0 || val === 1;
});



