import { defineStore } from "pinia";
import { ref } from 'vue'

export const useUserManagerStoreForSetup = defineStore('user-manager', () => {
    // 展示 drawer
    const show_drawer = ref(false);
    // 用户列表
    const common_user_list = ref<IUser[]>([]);

    return {
        show_drawer,
        common_user_list,
    }
});