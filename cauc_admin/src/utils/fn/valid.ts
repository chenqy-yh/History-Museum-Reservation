import { ElMessage } from "element-plus";

// 验证用户名  数字字母 字母开头
export const validUserName = (value: string) => {
    const reg = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/;
    return reg.test(value);
}

// 验证密码 数字字母
export const validPassword = (value: string) => {
    const reg = /^[a-zA-Z0-9]{6,16}$/;
    return reg.test(value);
}

// 验证确认密码
export const validConfirmPassword = (value: string, password: string) => {
    return value === password;
}

// 验证昵称  数字字母 中文
export const validNickName = (value: string) => {
    const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,10}$/;
    return reg.test(value);
}

// 验证邮箱
export const validMail = (value: string) => {
    const reg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return reg.test(value);
}

// 验证手机号
export const validPhone = (value: string) => {
    const reg = /^1[3456789]\d{9}$/;
    return reg.test(value);
}

// 验证性别 男 女
export const validSex = (value: string) => {
    const reg = /^0$|^1$/;
    return reg.test(value);
}

// 验证用户状态
export const validStatus = (value: string) => {
    const reg = /^0$|^1$/;
    return reg.test(value);
}

//  验证长度 包含最长和最短
export const validLength = (value: string, min: number, max: number) => {
    return value.length >= min && value.length <= max;
}

// 验证数字
export const validNumber = (value: string) => {
    const reg = /^[0-9]*$/;
    return reg.test(value);
}

// 校验合法性
export const isValid = (valid: boolean, error: string) => {
    if (!valid) {
        ElMessage.error(error);
        return false;
    }
    return valid;
};