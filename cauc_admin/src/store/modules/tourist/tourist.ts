import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useTouristStoreForSetup = defineStore('tourist', () => {
    const tourist_list = ref<ITourist[]>([]);

    const show_drawer = ref<boolean>(false);

    return {
        tourist_list,
        show_drawer
    }

})