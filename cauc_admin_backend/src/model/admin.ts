import { IsValidConfirmPsw, IsValidMail, IsValidPassword, IsValidSex, IsValidStatus, IsValidTel, IsValidUsername, IsValidNickName } from '../validator/admin.validator';
import { Length } from "class-validator";

type KeysOfAdminUpdateProfileDto = keyof AdminUpdateProfileDto;
const admin_update_profile_dto_keys: KeysOfAdminUpdateProfileDto[] = ['nickname', 'sex', 'status']

export class AdminCreateDto {
    @IsValidUsername('username', {
        message: 'username is invalid',
    })
    username: string;

    @IsValidPassword('password', {
        message: 'password is invalid',
    })
    password: string;

    @IsValidConfirmPsw('password', 'confirm_password', {
        message: 'confirm_password is invalid',
    })
    confirm_password: string;

    @IsValidNickName('nickname', {
        message: 'nickname is invalid',
    })
    nickname: string;

    @IsValidTel('tel', {
        message: 'tel is invalid',
    })
    tel: string;

    @IsValidMail('mail', {
        message: 'mail is invalid',
    })
    mail: string;

    @IsValidSex('sex', {
        message: 'sex is invalid',
    })
    sex: number;

    @IsValidStatus('status', {
        message: 'status is invalid',
    })
    status: number;

    @Length(0, 200, {
        message: 'remark is invalid',
    })
    remark: string;
}

// 修改用户密码 超级管理员
export class AdminUpdatePwdBySupperDto {

    @IsValidPassword('new_password', {
        message: 'new_password is invalid',
    })
    new_password: string;
    @IsValidConfirmPsw('new_password', 'confirm_password', {
        message: 'confirm_password is invalid',
    })
    confirm_password: string;
}

// 修改用户密码 普通管理员
export class AdminUpdatePwdDto extends AdminUpdatePwdBySupperDto {
    @IsValidPassword('old_password', {
        message: 'old_password is invalid',
    })
    old_password: string;
}

// 修改用户信息 超级管理员
export class AdminUpdateProfileDto {

    @IsValidNickName('nickname', {
        message: 'nickname is invalid',
    })
    nickname?: string;

    @IsValidSex('sex', {
        message: 'sex is invalid',
    })
    sex?: number;

    @IsValidStatus('status', {
        message: 'status is invalid',
    })
    status?: number;
}

export const checkValidOfAdminUpdateProfile = (tar_obj: AdminUpdateProfileDto) => {
    return !Object.keys(tar_obj).some(key => {
        return !admin_update_profile_dto_keys.includes(key as KeysOfAdminUpdateProfileDto);
    })
}