import { defineStore } from "pinia";
import { ref } from "vue";

export const useOrderDateStore = defineStore("order_date", () => {
  // 日期列表
  const date_block_list = ref([]);
  // 日期详情
  const dayDetail = ref({});

  // 时间段列表
  const time_list = ref([]);
  // 时间段预订状态
  const book_list = ref([]);


  // 是否还有讲解员
  const has_guide_list = ref([false, false]);

  // 展示日历
  const calendar_show = ref(false);
  // 展示时间段
  const dayTime_show = ref(false);

  return {
    date_block_list,
    time_list,
    book_list,
    dayDetail,
    has_guide_list,
    calendar_show,
    dayTime_show,
  };
});
