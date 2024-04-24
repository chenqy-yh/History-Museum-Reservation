import { getPageOrderByStatusList, getOrderCountByStatusList } from '@/utils/api/order';
import { defineStore } from "pinia";
import { Ref, ref } from 'vue';

export const useOrderStoreForSetup = defineStore("order", () => {
    
    const limit_row = 10;
    // 展示数据
    const tableData: Ref<IOrder[]> = ref([]);
    // 当前页
    const current_page = ref(1);
    // 当前展示页
    const current_show_page = ref(1);
    // 总页数
    const total_page = ref(1);
    // 总数据
    const totalData: Ref<IOrder[]> = ref([]);
    // 总数据量
    const total_count = ref(0);
    // 是否展示过的页
    const vis_page = new Set();
    // 选择的日期
    const choose_date_list = ref<string[]>([]);


    // filter
    // 操作状态列表
    const choose_operate_status_list = ref<number[]>([]);

    const choose_order_status_list = ref<number[]>([]);

    const choose_order_error_list = ref<number[]>([]);

    const choose_guide_assign = ref<number>(0);

    // 查询订单类型列表
    const type_list: Ref<number[]> = ref([]);
    // 展示pm_url
    const pm_url = ref();
    // pm 类型
    const pm_type = ref();


    // ------------------- ORDER SETTING ------------------
    const show_order_setting_drawer = ref(false);
    const active_order_setting_tab = ref();

    // ------------------- PERMISSION ---------------------
    // 展示dialog for pm_url
    const show_pm_dialog = ref(false);

    // ------------------- EDIT ORDER ---------------------
    // 展示dialog for edit order
    const show_edit_order_dialog = ref(false);
    // 编辑的订单数据
    const edit_order_data = ref<IOrder>({});



    // 展示dialog for pick guide
    const show_pick_guide_dialog = ref(false);


    // fn
    // 分页获取数据
    const fetchOrderByPage = async () => {
        if (!vis_page.has(current_page.value)) {
            const res = await getPageOrderByStatusList(current_page.value, limit_row, choose_date_list.value, choose_guide_assign.value, choose_operate_status_list.value, choose_order_status_list.value, choose_order_error_list.value);
            for (
                let i = (current_page.value - 1) * limit_row;
                i < current_page.value * limit_row;
                i++
            ) {
                totalData.value[i] = res.data[i - (current_page.value - 1) * limit_row];
            }
            vis_page.add(current_page.value);
        }
        let flag = -1;
        for (
            let i = (current_page.value - 1) * limit_row;
            i < current_page.value * limit_row;
            i++
        ) {
            if (totalData.value[i] !== undefined) {
                tableData.value[i - (current_page.value - 1) * limit_row] =
                    totalData.value[i];
            } else {
                flag = i - (current_page.value - 1) * limit_row;
                break;
            }
        }
        if (flag !== -1) {
            // 切掉flag后面的所有数据
            tableData.value.splice(flag);
        }
        current_show_page.value = current_page.value;
    };

    // 获取总数据量
    const fetchOrderCount = async () => {
        const res = await getOrderCountByStatusList(
            choose_date_list.value,
            choose_guide_assign.value,
            choose_operate_status_list.value,
            choose_order_status_list.value,
            choose_order_error_list.value
        );
        total_count.value = res.data;
        total_page.value = Math.ceil(total_count.value / limit_row);
        total_page.value = Math.max(total_page.value, 1);
    };

    // 初始化 根据订单类型列表加载订单
    const init = async (cur_page = 1) => {
        totalData.value = [];
        tableData.value = [];
        vis_page.clear();
        current_page.value = cur_page;
        current_show_page.value = 1;
        total_page.value = 1;
        total_count.value = 0;
        await fetchOrderCount();
        if (total_page.value < current_page.value) {
            current_page.value = total_page.value;
        }
        await fetchOrderByPage();
    };

    const init_filter = () => {
        choose_date_list.value = [];
        choose_operate_status_list.value = [];
        choose_order_status_list.value = [];
        choose_order_error_list.value = [];
        choose_guide_assign.value = 0;
    }


    // 下一页
    const nextPage = async () => {
        if (current_page.value === total_page.value) {
            return;
        }
        current_page.value += 1;
        await fetchOrderByPage();
    };

    // 上一页
    const backPage = async () => {
        if (current_page.value === 1) {
            return;
        }
        current_page.value -= 1;
        await fetchOrderByPage();
    };

    // 跳转到最后一页
    const goLastPage = async () => {
        current_page.value = total_page.value;
        await fetchOrderByPage();
    };

    // 跳转到第一页
    const goFirstPage = async () => {
        current_page.value = 1;
        await fetchOrderByPage();
    };

    // 检查跳转页
    const check_goto_page = async () => {
        if (isNaN(current_page.value)) {
            current_page.value = current_show_page.value;
        }

        // 判断是不是整数
        if (current_page.value % 1 !== 0) {
            current_page.value = current_show_page.value;
        }

        if (current_page.value < 1 || current_page.value > total_page.value) {
            current_page.value = current_show_page.value;
        }
        current_page.value = parseInt(current_page.value.toString());
        await fetchOrderByPage();
    };



    // 更改订单状态列表
    /**
     * @param type_list: number[] 订单类型列表
     * @returns void
     * 
     * */
    const changeOrderStatusList = async (typeList: number[]) => {
        type_list.value = typeList;
        await init();
    }

    return {
        tableData,
        current_page,
        current_show_page,
        total_page,
        totalData,
        total_count,
        pm_url,
        pm_type,
        show_edit_order_dialog,
        show_pm_dialog,
        edit_order_data,
        choose_operate_status_list,
        choose_order_error_list,
        choose_order_status_list,
        choose_guide_assign,
        choose_date_list,
        show_pick_guide_dialog,
        show_order_setting_drawer,
        active_order_setting_tab,
        fetchOrderByPage,
        fetchOrderCount,
        init,
        init_filter,
        nextPage,
        backPage,
        goLastPage,
        goFirstPage,
        // changeOrderStatus,
        check_goto_page,
        changeOrderStatusList,
    }

});