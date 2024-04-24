<template>
  <StatusBlock
    :status_idx="status_idx"
    :status_desc_list="status_desc_list"
    :cb="click"
    :opacity="status_idx === 0 ? 1 : 0.5"
    :clickable="clickable"
  >
    <view class="cn-date title-ff"> {{ time_desc }} </view>
    <view class="num-date"> {{ time_to_frame(timeItem.order_date) }} </view>
  </StatusBlock>
</template>

<script setup>
import StatusBlock from "./statusBlock.vue";

import { ref, watch } from "vue";
import { checkTimeout, getAmPm } from "../../utils/fn/index";

const props = defineProps({
  timeItem: {
    type: Object,
    default: () => {},
  },
  cb: {
    type: Function,
    default: () => {},
  },
  clickable: {
    type: Boolean,
    default: true,
  },
});

const time_desc = ref("");

const status_desc_list = ref(["可订", "约满", "过时"]);

const status_idx = ref(0);

//fn

// 把 8:30 这种时间 转换成  8:30 - 9:00
const time_to_frame = (time) => {
  try {
    const hmTime = time.split(" ")[1];
    const [hour, minute] = hmTime.split(":").map(Number);
    const time_stamp = (hour * 60 + minute + 30) % (24 * 60);
    const _hour = Math.floor(time_stamp / 60);
    const _minute = time_stamp % 60;
    // 输出不足2位的补0
    return `${hour}:${format_num(minute)} - ${_hour}:${format_num(_minute)}`;
  } catch (error) {
    console.log(error);
  }
};
// 不足2位的补0
const format_num = (num) => num.toString().padStart(2, "0");
const click = () => {
  props.cb(status_idx.value);
};

const getStatusIdx = () => {
  if (checkTimeout(props.timeItem.order_date)) {
    status_idx.value = 2;
  } else {
    status_idx.value = props.timeItem.full ? 1 : 0;
  }
};

watch(
  () => props.timeItem,
  (val) => {
    time_desc.value = getAmPm(val.order_date.split(" ")[1]);
    getStatusIdx();
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.cn-date {
  font-size: 13px;
  color: #5a4822;
}
.num-date {
  font-size: 11px;
  color: #5a4822;
}
</style>
