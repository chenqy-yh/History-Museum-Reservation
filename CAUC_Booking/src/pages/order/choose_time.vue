<template>
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
        <OrderBlock
          :full="false"
          :clickable="false"
          v-if="choose_time_list.length === 0"
        >
          <view class="selected-block"> 尚未选择 </view>
        </OrderBlock>

        <ChooseTimeBlock
          v-else
          v-for="(item, idx) in choose_time_list"
          :key="idx"
          :time-item="{
            order_date: item,
            full: false,
          }"
          :cb="() => deleteChooseTimeFromList(idx)"
        ></ChooseTimeBlock>
        <!-- <view v-for="(item, idx) in choose_time_list" :key="idx">
          {{ item }}
        </view> -->
      </view>
    </view>
  </view>

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
import Drawer from "../../components/drawer/drawer.vue";
import OrderBlock from "../../components/block/orderBlock.vue";
import TimeBlock from "../../components/block/timeBlock.vue";
import linkButton from "../../components/linkButton/linkButton.vue";
import CToast from "../../utils/fn/toast";
import ChooseTimeBlock from "../../components/block/chooseTimeBlock.vue";

import { storeToRefs } from "pinia";
import { useOrderDateStore, useOrderStore } from "../../store";

// -------------------- P R O P S -------------------- //
//store
const orderStore = useOrderStore();
const order_date_store = useOrderDateStore();
const { choose_date, choose_time_idx_list, choose_time_list } =
  storeToRefs(orderStore);
const { time_list, dayTime_show } = storeToRefs(order_date_store);

// ----------------- F U N C T I O N ----------------- //
// 从calender选择日期
const onChooseTime = (item) => {
  if (item.status_idx === 0) {
    //检查选择时间是否存在跨上午 下午 item.idx 0-5 上午 6-11 下午
    if (
      validate(detectTimeframeCross(item.idx), "上午下午时间不能混合选择") &&
      validate(
        detectTimeIsDiscontinuityForAdd(item.idx),
        "变更后时间段必须连续"
      )
    ) {
      choose_time_list.value = choose_time_list.value.filter(
        (it) => it !== item.order_date
      );
      choose_time_idx_list.value = choose_time_idx_list.value.filter(
        (it) => it !== item.idx
      );
      choose_time_list.value.push(item.order_date);
      choose_time_idx_list.value.push(item.idx);
      //sort date and idx
      choose_time_list.value.sort((a, b) => {
        return new Date(a) - new Date(b);
      });
      choose_time_idx_list.value.sort((a, b) => {
        return a - b;
      });
      dayTime_show.value = false;
    }
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

const validate = (valid, errorMessage) => {
  if (!valid) {
    CToast.error(errorMessage, 2000);
    return false;
  }
  return true;
};

const detectTimeIsDiscontinuityForAdd = (next_idx) => {
  const tmp_list = [...choose_time_idx_list.value, next_idx];
  tmp_list.sort((a, b) => {
    return a - b;
  });
  for (let i = 0; i < tmp_list.length - 1; i++) {
    if (tmp_list[i + 1] - tmp_list[i] > 1) {
      return false;
    }
  }
  return true;
};

const detectTimeIsDiscontinuityForDel = (next_idx) => {
  return next_idx == 0 || next_idx == choose_time_idx_list.value.length - 1;
};

const detectTimeframeCross = (next_idx) => {
  let am = next_idx < 6;
  let pm = next_idx >= 6;
  for (let item in choose_time_idx_list.value) {
    if (item < 6) {
      am = true;
    } else {
      pm = true;
    }
  }
  return !(am && pm);
};

const deleteChooseTimeFromList = (idx) => {
  //检测删除后时间段是否连续
  if (validate(detectTimeIsDiscontinuityForDel(idx), "变更后时间段必须连续")) {
    choose_time_list.value.splice(idx, 1);
    choose_time_idx_list.value.splice(idx, 1);
  }
};
</script>

<style lang="scss" scoped>
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
</style>
