<template>
  <view class="header-container">
    <view
      class="header"
      :style="{
        backgroundColor: backgroundColor,
      }"
    >
    </view>
    <view
      class="title title-ff"
      :style="{
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
      ></image>
    </view>
  </view>
</template>

<script setup>
import { onReady } from "@dcloudio/uni-app";
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "中国民航大学校史馆",
  },
  backgroundColor: {
    type: String,
    default: "transparent",
  },
});

const show_back = ref(false);
const menu_button_pos = ref(uni.getMenuButtonBoundingClientRect());

onReady(() => {
  show_back.value = getCurrentPages().length > 1;
});

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
  height: 9vh;
  z-index: 999;
  .header {
    height: 100%;
    width: 100%;
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
    color: #5a4822;
  }
  .back-btn {
    position: absolute;
    left: 2vw;
    display: flex;
    align-items: center;
    image {
      width: 25px;
      height: 25px;
      filter: brightness(0);
    }
  }
}
</style>
