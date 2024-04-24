<template>
  <view class="main-content">
    <view class="cn-date title-ff"> {{ time_desc }} </view>
    <view class="num-date"> {{ time_to_frame(timeItem.order_date) }} </view>
    <image
      @click="cb"
      class="close"
      src="/static/img/icon/close.png"
      mode="aspectFit"
    ></image>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onReady } from "@dcloudio/uni-app";
import { getAmPm } from "../../utils/fn";

const props = defineProps({
  timeItem: {
    type: Object,
    default: () => {},
  },
  cb: {
    type: Function,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
});

// -------------------- P R O P S -------------------- //

const time_desc = ref("");

// ------------------- C I R C L E ------------------- //

onReady(() => {
  time_desc.value = getAmPm(props.timeItem.order_date.split(" ")[1]);
});

// ----------------- F U N C T I O N ----------------- //

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
    console.log("time_to_frame", time);
    console.log(error);
  }
};
// 不足2位的补0
const format_num = (num) => num.toString().padStart(2, "0");
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

.main-content {
  border: 1px solid #e8d8c1;
  width: 100%;
  aspect-ratio: 4/3;
  padding: 1vw;
  box-sizing: border-box;
  border-radius: 1.5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  background-color: #f4ede3;
  .close {
    position: absolute;
    width: 15px;
    height: 15px;
    top: 1vw;
    right: 1vw;
  }
}
</style>
