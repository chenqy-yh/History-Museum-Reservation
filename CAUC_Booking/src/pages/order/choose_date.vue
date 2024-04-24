<template>
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

  <!-- 日期 -->
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
</template>

<script setup>
import DateBlock from "../../components/block/dateBlock.vue";
import OrderBlock from "../../components/block/orderBlock.vue";
import Calendar from "../../components/calendar/calendar.vue";
import Drawer from "../../components/drawer/drawer.vue";
import linkButton from "../../components/linkButton/linkButton.vue";

import { storeToRefs } from "pinia";
import { useOrderDateStore, useOrderStore } from "../../store";
import CToast from "../../utils/fn/toast";
import { getDayCapacity } from "../../utils/http/date";

// -------------------- P R O P S -------------------- //
//store
const order_store = useOrderStore();
const order_date_store = useOrderDateStore();
const {
  choose_date,
  choose_time,
  choose_time_idx,
  choose_time_list,
  choose_time_idx_list,
} = storeToRefs(order_store);
const {
  book_list,
  date_block_list,
  dayDetail,
  time_list,
  has_guide_list,
  calendar_show,
} = storeToRefs(order_date_store);

// ----------------- F U N C T I O N ----------------- //
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
        console.log("getDayCapacity:", res);
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
    choose_time_list.value = [];
    choose_time_idx_list.value = [];
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
</script>

<style lang="scss" scoped>
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
</style>
