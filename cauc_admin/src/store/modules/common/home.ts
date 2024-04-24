import { IHistoryLink } from "@/typings/router";
import { defineStore } from "pinia";
import { ref } from "vue";


export const useHomeStoreForSetup = defineStore('home', () => {
    const historyList = ref<IHistoryLink[]>([]);
    const loading_order = ref(false);
    const showMenu = ref(true);

    const function_list = ref<{
        title: string,
        name: string,
    }[]>([
        {
            title: "订单管理",
            name: "Order",
        },
        {
            title: "订单日历",
            name: "OrderCalendar",
        },
        {
            title: "预订详情",
            name: "Detail",
        },
    ])


    const addHistorLink = (historyLink: IHistoryLink) => {
        // 检查是否有重复
        historyList.value = historyList.value.filter(item => item.to !== historyLink.to)
        historyList.value.unshift(historyLink)
    }


    return {
        loading_order,
        historyList,
        showMenu,
        addHistorLink
    }

});