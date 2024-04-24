import { defineStore } from "pinia"
import { ref, shallowRef } from "vue"
import { queryRecordByDate } from "@/utils/api/record"


export const useOrderCalendarStoreForSetup = defineStore("record", () => {

    // ----------------- C O N S T A N T ----------------- //

    // 每日订单记录
    const record = ref<IRecord>()
    // 选中的场次订单
    const choose_order_item = ref<IOrderItem>()
    const choose_order = ref<IOrder>()

    // show drawer
    const show_drawer = ref<boolean>(false)
    const drawer_component = shallowRef()
    const drawer_title = ref<string>("")


    // ----------------- F U N C T I O N ----------------- //
    const getRecordByDate = async (date: string) => {
        await queryRecordByDate(date).then(res => {
            record.value = res.data.record
        });
    }

    return {
        record,
        show_drawer,
        drawer_component,
        choose_order_item,
        choose_order,
        drawer_title,
        getRecordByDate
    }

})