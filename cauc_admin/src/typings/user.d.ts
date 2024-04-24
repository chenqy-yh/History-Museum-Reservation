interface IUser {
    avatar: string,
    createdAt: string,
    f_admin_id: number,
    id: number,
    mail: string,
    nickname: string,
    username: string,
    role: string,
    sex: number,
    tel: string,
    status: number,
    updatedAt: string,
    remark: string,
    f_admin: {
        username: string,
        nickname: string,
    }
}

interface IUserUpdatePwd {
    old_password?: string,
    new_password?: string,
    confirm_password?: string,
}

interface IUserUpdateProfile {
    nickname?: string,
    tel?: string,
    mail?: string,
    sex?: number,
    status?: number,
    remark?: string,
}