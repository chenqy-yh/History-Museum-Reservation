import axios, { AxiosResponse } from "axios"
import { apiService } from "@/utils/http";

// 登陆
export const login = (username: string, password: string): Promise<AxiosResponse<ILoginResponseData>> => {

    return apiService.post<ILoginResponseData>('/auth/login', {
        username,
        password,
    });
}

// 获取个人信息
export const getSelfInfo = () => {
    return apiService.get<IUser>('/admin/selfinfo')
}



// only super admin can use this api
// 获取所有普通管理员
export const getCommonUserList = () => {
    return apiService.get<IUser[]>('/admin/getCommonUser')
}

// 创建用户
export const createUser = (user_info: any) => {
    return apiService.post('/admin/addUser', user_info)
}

// 更新用户信息---密码
export const updateUserPwd = (user_id: number, update_user_pwd: IUserUpdatePwd) => {
    return apiService.post('/admin/updateAdminPwdBySuper', {
        user_id: user_id,
        update_user_pwd: update_user_pwd
    })
}


export const updateUserProfile = (user_id: number, update_user_profile: IUserUpdateProfile) => {
    return apiService.post('/admin/updateAdminProfileBySuper', {
        user_id: user_id,
        update_user_profile: update_user_profile
    })
}

// 逻辑删除用户
export const deleteUser = (username: string) => {
    return apiService.post('/admin/del', {
        username: username
    })
}

