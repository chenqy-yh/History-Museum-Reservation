<template>
  <BaseLayout>
    <Header
      :title="title"
      :scroll-top="scrollTop"
      v-if="!useStaticHeader"
    ></Header>
    <StaticHeader
      :title="title"
      background-color="#f8f3e8"
      v-else
    ></StaticHeader>
    <view class="main-content">
      <view class="header">
        <image mode="aspectFill" :src="bg_url"></image>
      </view>
      <view class="content">
        <slot></slot>
      </view>
    </view>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from "../baseLayout/baseLayout.vue";
import Header from "../../components/header/header.vue";
import StaticHeader from "../../components/header/staticHeader.vue";
import { ref } from "vue";
import { onPageScroll } from "@dcloudio/uni-app";
const props = defineProps({
  bg_url: {
    type: String,
  },
  title: {
    type: String,
    default: "",
  },
  useStaticHeader: {
    type: Boolean,
    default: false,
  },
});

const scrollTop = ref(0);

onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});
</script>

<style lang="scss" scoped>
.main-content {
  box-sizing: border-box;
  min-height: 100vh;
  display: grid;
  grid-template-rows: 30vh 1fr;
  .header {
    width: 100%;
    image {
      width: 100vw;
      max-height: 30vh;
    }
  }
  .content {
    box-sizing: border-box;
    position: relative;
    background-color: #f8f3e8;
    padding-inline: 20px;
    &::before {
      content: "";
      position: absolute;
      top: -5vh;
      left: 0;
      width: 100%;
      height: 5vh;
      border-top-left-radius: 3vh;
      border-top-right-radius: 3vh;
      background-color: #f8f3e8;
    }
  }
}
</style>
