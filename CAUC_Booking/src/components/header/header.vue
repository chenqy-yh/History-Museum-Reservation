<template>
  <view class="header-container">
    <view
      class="header"
      :style="{
        opacity: header_opcaty,
      }"
    >
    </view>
    <view
      class="title title-ff"
      :style="{
        color: color,
        top: `${menu_button_pos.top}px`,
        height: `${menu_button_pos.height}px`,
      }"
    >
      {{ title }}
    </view>
    <view
      class="back-btn"
      :style="{
        top: `${menu_button_pos.top}px`,
        height: `${menu_button_pos.height}px`,
      }"
    >
      <image
        src="/static/img/icon/left.png"
        mode="aspectFit"
        v-if="show_back"
        @click="back"
        :style="{
          filter: `brightness(${bright})`,
        }"
      ></image>
    </view>
  </view>
</template>

<script setup>
import { onReady } from "@dcloudio/uni-app";
import { ref, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "中国民航大学校史馆",
  },
  scrollTop: {
    type: Number,
    default: 0,
  },
});

const menu_button_pos = ref(uni.getMenuButtonBoundingClientRect());

const header_opcaty = ref(0);
const color = ref("rgb(248,243,232)");
const bright = ref(1);
const show_back = ref(false);

const steps = 200; // 渐变步数
const limit = 200;
const initialColor = [248, 243, 232]; // 初始颜色（白色）
const finalColor = [0, 0, 0]; // 最终颜色（黑色）

watch(
  () => props.scrollTop,
  (val) => {
    header_opcaty.value = val >= limit ? 1 : val / limit;
    color.value = val >= limit ? "rgb(0,0,0)" : changeBackgroundColor(val);
    bright.value = val >= limit ? 0 : 1 - val / limit;
  }
);

onReady(() => {
  show_back.value = getCurrentPages().length > 1;
});

function changeBackgroundColor(nowStep) {
  return colorTransition(nowStep);
}

const colorTransition = (step) => {
  const r = Math.round(
    initialColor[0] - (initialColor[0] - finalColor[0]) * (step / steps)
  );
  const g = Math.round(
    initialColor[1] - (initialColor[1] - finalColor[1]) * (step / steps)
  );
  const b = Math.round(
    initialColor[2] - (initialColor[2] - finalColor[2]) * (step / steps)
  );
  return `rgb(${r}, ${g}, ${b})`;
};

const back = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 10vh;
  z-index: 999;
  .header {
    height: 100%;
    width: 100%;
    background-color: #f8f3e8;
  }
  .title {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -0%);
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
  .back-btn {
    position: absolute;
    left: 2vw;
    display: flex;
    align-items: center;
    image {
      width: 25px;
      height: 25px;
    }
  }
}
</style>
