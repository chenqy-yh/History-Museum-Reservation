import { defineStore } from "pinia";
import { reactive, ref } from "vue";


export const useGuideStoreForSetup = defineStore("guide", () => {
    // -------------------- P R O P S -------------------- //

    // drawer title
    const drawer_title = ref("");

    // 修改引导员信息
    const update_guide_info = ref({
        id: -1,
        name: "",
        staff_id: "",
        group: "",
        tel: "",
    });


    // 引导员列表
    const guide_list = ref<IGuide[]>([]);
    // 引导员未完成订单列表
    const unfinish_order_list = ref<IOrder[]>([]);

    // 展开 drawer
    const show_drawer = ref(false);
    // 是否显示添加引导员对话框
    const show_add_guide_dialog = ref(false);
    // 是否显示更新引导员对话框
    const show_updete_guide_dialog = ref(false);
    // 是否显示引导员未完成订单对话框
    const show_query_guide_unfinish_order_dialog = ref(false);


    return {
        drawer_title,
        update_guide_info,
        guide_list,
        unfinish_order_list,
        show_drawer,
        show_add_guide_dialog,
        show_updete_guide_dialog,
        show_query_guide_unfinish_order_dialog
    }
})