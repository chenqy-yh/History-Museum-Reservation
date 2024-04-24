import { defineStore } from "pinia";
import { ref } from 'vue'

export const useNoticeManagerStoreForSetup = defineStore('notice-manager', () => {
    // const notice_list = ref<IMsg[]>([
    //     {
    //         text: '欢迎使用 Leaf Admin',
    //         delay: 5000,
    //         type: 'info'
    //     },
    //     {
    //         text: '网站开发 致电 13048451151',
    //         delay: 5000,
    //         type: 'info'
    //     },
    //     {
    //         text: '期待更多精彩的合作',
    //         delay: 5000,
    //         type: 'success'
    //     },
    // ])
    const notice_list = ref<IMsg[]>([])
    return {
        notice_list
    };
})