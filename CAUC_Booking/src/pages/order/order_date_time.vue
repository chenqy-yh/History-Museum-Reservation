<!-- <template>
  <SimpleLayout title="选择日期" :fixed="calendar_show || dayTime_show">
    <view class="visit-title title-ff"> 中国民航大学校史馆 </view>
    <view class="choose-date-block">
      <view class="choose-area">
        <view class="title-ff choose-title"> 参观日期 </view>
        <view class="date-block-list">
          <DateBlock
            :date="item.date"
            v-for="(item, idx) in date_block_list"
            :key="idx"
            :status_idx="item.status_idx"
            :cb="
              () =>
                onChooseDate({
                  status_idx: item.status_idx,
                  date: item.status_idx === 0 ? item.date : null,
                })
            "
          ></DateBlock>
          <OrderBlock
            :full="false"
            :cb="() => (calendar_show = true)"
            :show-status="false"
          >
            <linkButton
              :contentStyle="{
                'font-size': '13px',
                'font-weight': '500',
              }"
              text="指定日期"
              class="title-ff"
            ></linkButton>
          </OrderBlock>
        </view>
      </view>
      <view class="selected-area">
        <view class="title-ff choose-title"> 选择日期 </view>
        <view class="date-block-list">
          <OrderBlock :full="false" v-if="!choose_date" :clickable="false">
            <view class="selected-block title-ff">
              {{ "尚未选择" }}
            </view>
          </OrderBlock>
          <DateBlock
            :date="choose_date"
            v-else
            :full="false"
            :clickable="false"
          ></DateBlock>
        </view>
      </view>
    </view>
    <view class="choose-time-block" v-if="choose_date">
      <view class="choose-area">
        <view class="title-ff choose-title"> 参观时间 </view>
        <view class="time-block-list">
          <TimeBlock
            v-for="(item, idx) in time_list.slice(0, 3)"
            :key="idx"
            :time-item="item"
            :cb="
              (status_idx) =>
                onChooseTime({
                  status_idx: status_idx,
                  order_date: item.order_date,
                  idx: item.idx,
                })
            "
          ></TimeBlock>

          <OrderBlock
            :full="false"
            :show-status="false"
            :cb="() => (dayTime_show = true)"
          >
            <linkButton
              :contentStyle="{
                'font-size': '13px',
                'font-weight': '500',
              }"
              text="指定时间"
              class="title-ff"
            ></linkButton>
          </OrderBlock>
        </view>
      </view>
      <view class="selected-area">
        <view class="title-ff choose-title"> 选择日期 </view>
        <view class="time-block-list">
          <OrderBlock :full="false" :clickable="false" v-if="!choose_time">
            <view class="selected-block">
              {{ choose_time ? choose_time : "尚未选择" }}
            </view>
          </OrderBlock>
          <TimeBlock
            v-else
            :clickable="false"
            :time-item="{
              order_date: choose_time,
              full: false,
            }"
            :date="choose_date"
          ></TimeBlock>
        </view>
      </view>
    </view>
    <button
      class="next-step title-ff"
      v-if="choose_date"
      :class="{
        active: choose_time && choose_date,
      }"
      @click="linkNextStep"
    >
      下一步
    </button>
  </SimpleLayout>
  <Drawer
    v-model="calendar_show"
    :custom_style="{
      backgroundColor: '#f8f3e8',
      borderRadius: '5vw 5vw 0 0',
    }"
  >
    <view class="calender-container">
      <view class="header">
        <view class="title title-ff"> 请选择参观日期 </view>
        <image
          src="/static/img/icon/close.png"
          @click="calendar_show = false"
        ></image>
      </view>
      <scroll-view scroll-y="true" class="calender">
        <Calendar
          :on-choose-date="(item) => onChooseDate(item)"
          :dayDetail="dayDetail"
        ></Calendar>
      </scroll-view>
    </view>
  </Drawer>
  <Drawer
    v-model="dayTime_show"
    :custom_style="{
      backgroundColor: '#f8f3e8',
      borderRadius: '5vw 5vw 0 0',
    }"
  >
    <view class="daytime-container">
      <view class="header">
        <view class="title title-ff"> 请选择参观时间 </view>
        <image
          src="/static/img/icon/close.png"
          @click="dayTime_show = false"
        ></image>
      </view>
      <view class="title-ff sub-title">上午</view>
      <view class="time-block-list">
        <TimeBlock
          v-for="(item, idx) in time_list.slice(0, 6)"
          :key="idx"
          :time-item="item"
          :cb="
            (status_idx) =>
              onChooseTime({
                status_idx: status_idx,
                order_date: item.order_date,
                idx: item.idx,
              })
          "
        ></TimeBlock>
      </view>
      <view class="title-ff sub-title">下午</view>
      <view class="time-block-list">
        <TimeBlock
          v-for="(item, idx) in time_list.slice(6, 12)"
          :key="idx"
          :time-item="item"
          :cb="
            (status_idx) =>
              onChooseTime({
                status_idx: status_idx,
                idx: item.idx,
                order_date: item.order_date,
              })
          "
        ></TimeBlock>
      </view>
    </view>
  </Drawer>
</template>

<script setup>
import DateBlock from "../../components/block/dateBlock.vue";
import OrderBlock from "../../components/block/orderBlock.vue";
import TimeBlock from "../../components/block/timeBlock.vue";
import Calendar from "../../components/calendar/calendar.vue";
import Drawer from "../../components/drawer/drawer.vue";
import linkButton from "../../components/linkButton/linkButton.vue";
import SimpleLayout from "../../layout/simpleLayout/simpleLayout.vue";

import { onReady } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useOrderStore } from "../../store";
import { getDayCapacity, getFreeDayByMonth_v2 } from "../../utils/http/date";
import CToast from "../../utils/fn/toast";

//store
const orderStore = useOrderStore();
const { choose_date, choose_time, choose_time_idx, has_guide } =
  storeToRefs(orderStore);

const calendar_show = ref(false);
const dayTime_show = ref(false);

// 是否还有讲解员
const has_guide_list = ref([false, false]);
// 日期列表
const date_block_list = ref([]);
// 时间段列表
const time_list = ref([]);

// 时间段预订状态
const book_list = ref([]);

const dayDetail = ref({});

onReady(async () => {
  // query_month.sort((a, b) => a - b);
  // query_month 从这个月开始算 2023-10,2023-11 往后推6个月
  const st_y = new Date().getFullYear();
  const st_m = new Date().getMonth() + 1;
  const query_month = [];
  for (let i = 0; i < 6; i++) {
    // push yyyy-mm 考虑到跨年
    query_month.push(
      `${st_y + Math.floor((st_m + i - 1) / 12)}-${((st_m + i - 1) % 12) + 1}`
    );
  }

  getFreeDayByMonth_v2(query_month).then((res) => {
    dayDetail.value = res.data;
    for (let i = 0; i < 3; i++) {
      // let targetDate = new Date();
      // 从今天开始往后推3天
      let targetDate = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);

      targetDate.setDate(targetDate.getDate() + i);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth() + 1;
      const targetDay = targetDate.getDate();
      const day_str = `${targetYear}-${targetMonth}-${targetDay}`;
      let is_close = false;
      let is_free = false;
      dayDetail.value.forEach((it) => {
        is_close ||=
          it.m == targetMonth &&
          it.detail.close_day.some((day) => day == targetDay);
        is_free ||=
          it.m == targetMonth &&
          it.detail.free_day.some((day) => day == targetDay);
      });
      date_block_list.value.push({
        date: day_str,
        status_idx: is_close ? 2 : is_free ? 0 : 1,
      });
    }
  });
});

// fn
// 从calender选择日期

const fetchDayCapacity = async () => {
  if (choose_date.value !== undefined) {
    // 格式化choose_date.value  yyyy-mm-dd
    const _choose_date = choose_date.value
      .split("-")
      .map((it) => it.padStart(2, "0"))
      .join("-");
    await getDayCapacity(_choose_date)
      .then((res) => {
        console.log(res);
        //时间段详情列表 OBJECT
        time_list.value = [...res.data.time_frame_details];
        // 预订详情列表 BOOL
        book_list.value = [...res.data.time_frame_details.map((it) => it.full)];
        // 是否还有讲解员
        has_guide_list.value = [...res.data.has_guide];
        // 重置选择时间
        choose_time.value = undefined;
        choose_time_idx.value = undefined;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const onChooseDate = (item) => {
  if (item.status_idx === 0) {
    if (choose_date.value === item.date) {
      choose_date.value = undefined;
    } else {
      choose_date.value = item.date;
    }
    calendar_show.value = false;
  } else {
    switch (item.status_idx) {
      case 1:
        CToast.error("该日期已满", 1500);
        break;
      case 2:
        CToast.error("该日期已过时", 1500);
        break;
    }
  }
  fetchDayCapacity(choose_date.value);
};
const onChooseTime = (item) => {
  if (item.status_idx === 0) {
    if (choose_time.value == item.order_date) {
      choose_time.value = undefined;
      choose_time_idx.value = undefined;
    } else {
      choose_time.value = item.order_date;
      choose_time_idx.value = item.idx;
    }
    dayTime_show.value = false;
  } else {
    switch (item.status_idx) {
      case 1:
        CToast.error("该日期已满", 1500);
        break;
      case 2:
        CToast.error("该时间已过时", 1500);
        break;
    }
  }
};

const linkNextStep = () => {
  if (choose_date.value && choose_time.value && choose_time_idx.value >= 0) {
    has_guide.value =
      choose_time_idx.value < 6
        ? has_guide_list.value[0]
        : has_guide_list.value[1];
    uni.navigateTo({
      url: "/pages/order/order_applicant",
    });
  } else {
    CToast.error("请选择日期和时间", 1500);
  }
};
</script>

<style lang="scss" scoped>
.visit-title {
  font-size: 22px;
  font-weight: 600;
  color: #5a4822;
  box-sizing: border-box;
  padding-block: 2vh;
  border-bottom: 1px solid #e3dac8;
}
.choose-date-block {
  border-bottom: 1px solid #e3dac8;
  padding-bottom: 2vh;
  .choose-title {
    padding-block: 2vh;
  }
  .title-ff {
    font-size: 18px;
    font-weight: 600;
    color: #5a4822;
  }
  .date-block-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1vw;
    .choose-date-btn {
      background-color: #f4ede3;
      display: flex;
      align-items: center;
      padding-inline: 2vw;
      border-radius: 1vw;
      border: 1px solid #e8d1ca;
    }
    .selected-block {
      font-size: 13px;
      color: #5a4822;
    }
  }
}
.choose-time-block {
  border-bottom: 1px solid #e3dac8;
  padding-bottom: 2vh;
  .choose-title {
    padding-block: 2vh;
  }
  .title-ff {
    font-size: 18px;
    font-weight: 600;
    color: #5a4822;
  }
  .time-block-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr) 1fr;
    gap: 1vw;
    font-size: 13px;

    .choose-date-btn {
      background-color: #f4ede3;
      display: flex;
      align-items: center;
      padding-inline: 2vw;
      border-radius: 1vw;
      border: 1px solid #e8d1ca;
    }
    .selected-block {
      color: #5a4822;
      font-family: Georgia, serif;
    }
  }
}
.next-step {
  margin-block: 5vh;
  border: none;
  width: 40vw;
  height: 7vh;
  background: #cebe9e;
  border-radius: 1vw;
  color: #fffcf7;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  font-weight: 600;
  font-size: 20px;
  &.active {
    opacity: 1;
  }
}
.calender-container {
  box-sizing: border-box;
  height: 80vh;
  padding-inline: 4vw;
  padding-top: 4vh;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .title {
      font-size: 22px;
      font-weight: 600;
      text-align: center;
    }
    image {
      position: absolute;
      width: 20px;
      height: 20px;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      filter: brightness(0);
    }
  }
  .calender {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 10vh;
    bottom: 0;
  }
}
.daytime-container {
  box-sizing: border-box;
  height: 80vh;
  padding-inline: 4vw;
  padding-top: 4vh;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .title {
      font-size: 22px;
      font-weight: 600;
      text-align: center;
    }
    image {
      position: absolute;
      width: 20px;
      height: 20px;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      filter: brightness(0);
    }
  }
  .sub-title {
    font-size: 20px;
    // border:1px solid red;
    text-align: center;
    margin-block: 4vh 3vh;
  }
  .time-block-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1vw;
    font-size: 13px;
    margin-block: 2vh;
  }
}
</style> -->

<template>
  <SimpleLayout title="选择日期" :fixed="calendar_show || dayTime_show">
    <view class="visit-title title-ff"> 中国民航大学校史馆 </view>
    <ChooseDateBlock></ChooseDateBlock>
    <ChooseTimeBlock></ChooseTimeBlock>
    <button
      class="next-step title-ff"
      v-if="choose_date"
      :class="{
        active: choose_time_list.length > 0 && choose_date,
      }"
      @click="linkNextStep"
    >
      下一步
    </button>
  </SimpleLayout>
</template>

<script setup>
import SimpleLayout from "../../layout/simpleLayout/simpleLayout.vue";
import ChooseDateBlock from "./choose_date.vue";
import ChooseTimeBlock from "./choose_time.vue";
import CToast from "../../utils/fn/toast";

import { onReady } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { useOrderDateStore, useOrderStore } from "../../store";
import { getFreeDayByMonth_v2 } from "../../utils/http/date";

// -------------------- P R O P S -------------------- //
//store
const orderStore = useOrderStore();
const order_date_store = useOrderDateStore();
const { choose_date, has_guide, choose_time_list, choose_time_idx_list } =
  storeToRefs(orderStore);
const {
  dayDetail,
  date_block_list,
  has_guide_list,
  calendar_show,
  dayTime_show,
} = storeToRefs(order_date_store);

// ------------------- C I R C L E ------------------- //

onReady(async () => {
  const st_y = new Date().getFullYear();
  const st_m = new Date().getMonth() + 1;
  const query_month = [];
  for (let i = 0; i < 6; i++) {
    // push yyyy-mm 考虑到跨年
    query_month.push(
      `${st_y + Math.floor((st_m + i - 1) / 12)}-${((st_m + i - 1) % 12) + 1}`
    );
  }

  getFreeDayByMonth_v2(query_month).then((res) => {
    date_block_list.value = [];
    dayDetail.value = res.data;
    for (let i = 0; i < 3; i++) {
      // let targetDate = new Date();
      // 从今天开始往后推3天
      let targetDate = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);

      targetDate.setDate(targetDate.getDate() + i);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth() + 1;
      const targetDay = targetDate.getDate();
      const day_str = `${targetYear}-${targetMonth}-${targetDay}`;
      let is_close = false;
      let is_free = false;
      dayDetail.value.forEach((it) => {
        is_close ||=
          it.m == targetMonth &&
          it.detail.close_day.some((day) => day == targetDay);
        is_free ||=
          it.m == targetMonth &&
          it.detail.free_day.some((day) => day == targetDay);
      });
      date_block_list.value.push({
        date: day_str,
        status_idx: is_close ? 2 : is_free ? 0 : 1,
      });
    }
  });
});

// ----------------- F U N C T I O N ----------------- //

const linkNextStep = () => {
  if (
    choose_date.value &&
    choose_time_list.value.length > 0 &&
    choose_time_idx_list.value.length > 0
  ) {
    has_guide.value =
      choose_time_idx_list.value[0] < 6
        ? has_guide_list.value[0]
        : has_guide_list.value[1];
    uni.navigateTo({
      url: "/pages/order/order_applicant",
    });
  } else {
    CToast.error("请选择日期和时间", 1500);
  }
};
</script>

<style lang="scss" scoped>
.visit-title {
  font-size: 22px;
  font-weight: 600;
  color: #5a4822;
  box-sizing: border-box;
  padding-block: 2vh;
  border-bottom: 1px solid #e3dac8;
}
.next-step {
  margin-block: 5vh;
  border: none;
  width: 40vw;
  height: 7vh;
  background: #cebe9e;
  border-radius: 1vw;
  color: #fffcf7;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  font-weight: 600;
  font-size: 20px;
  &.active {
    opacity: 1;
  }
}
</style>
