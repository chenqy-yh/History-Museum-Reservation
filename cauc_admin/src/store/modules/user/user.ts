import { login as _login } from '@/utils/api'
import { get, remove } from '@/utils/store'
import { Auth, Router } from '@/utils/store/keys'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSelfInfo as _get_self_info } from '@/utils/api/user'


export const useUserStoreForSetup = defineStore('user', () => {

    const self_info = ref<IUser>();

    // show
    const show_drawer = ref<boolean>(false);

    // function

    const login = async (userData: ILoginRequestData): Promise<boolean> => {
        return await _login(userData.input_username, userData.input_password).then(async (_) => {
            return true;
        }).catch(err => {
            console.log('login err', err);
            return false;
        });
    }

    // 登出
    const logout = () => {
        remove(Auth.ACCESS_TOKEN)
        remove(Auth.REFRESH_TOKEN)
        remove(Router.DYNAMIC_ROUTE_LIST)
    }

    // 获取自身信息
    const getSelfInfo = async () => {
        try {
            const res = await _get_self_info()
            self_info.value = res.data
        } catch (error) {
            ElMessage.error('获取个人信息失败')
        }
    }

    return {
        show_drawer,
        self_info,
        login,
        logout,
        getSelfInfo,
    }

})
