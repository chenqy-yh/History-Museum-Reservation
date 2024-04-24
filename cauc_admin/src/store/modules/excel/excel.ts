import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useExcelStoreForSetup = defineStore("excel", () => {
    
    // -------------------- P R O P S -------------------- //
    // 展示excel drawer
    const show_excel_drawer = ref(false);
    // 当前步骤
    const active_step = ref(1);
    // 选择的方式
    const choose_way = ref(1);
    // 选择的日期列表
    const choose_day_list = ref<string[]>([]);
    // 选择的月份列表
    const choose_month_list = ref<string[]>([]);
    // 选择的年份列表
    const choose_year_list = ref<string[]>([]);
    // loading
    const excel_loading = ref(false);

    // ------------------- C I R C L E ------------------- //
    // 当关闭excel_drawer时，重置数据
    watch(() => show_excel_drawer.value, (val) => {
        if (!val) {
            resetData();
        }
    })

    // ----------------- F U N C T I O N ----------------- //
    const resetData = () => {
        active_step.value = 1;
        choose_way.value = 1;
        choose_day_list.value = [];
        choose_month_list.value = [];
        choose_year_list.value = [];
        excel_loading.value = false;
    }


    return {
        show_excel_drawer,
        active_step,
        choose_way,
        choose_day_list,
        choose_month_list,
        choose_year_list,
        excel_loading,
    }
});