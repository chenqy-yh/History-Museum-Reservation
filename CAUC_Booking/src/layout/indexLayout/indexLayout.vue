<template>
  <BaseLayout>
    <view class="main-content">
      <Header
        title="中国民航大学校史馆"
        :scroll-top="props.scrollTop"
        v-if="!useStaticHeader"
      ></Header>
      <StaticHeader
        title="中国民航大学校史馆"
        background-color="#f8f3e8"
        v-else
      ></StaticHeader>
      <view class="swiper-container">
        <swiper
          class="swiper-list"
          autoplay="true"
          :interval="2000"
          :duration="500"
          circular="true"
          easing-function="true"
          @change="swiperChange"
        >
          <swiper-item
            class="swiper-item"
            v-for="(item, index) in swiper_list"
            :key="index"
          >
            <image :src="item.url"></image>
            <view class="title"> {{ item.title }} </view>
          </swiper-item>
        </swiper>
        <view class="swiper-dots">
          <view
            class="swiper-dot"
            :class="{
              active: item,
            }"
            v-for="(item, idx) in dots_active"
            :key="idx"
          >
          </view>
        </view>
      </view>
      <view class="content">
        <!-- 流动公告 -->
        <!-- <view
        class="announcement"
        @click.stop="() => linkTo('/pages/notice/notice')"
      >
        <image src="/static/img/icon/broadcast.png" mode="aspectFit"></image>
        <view :animation="animation_data">
          {{ broadcast_list[broadcast_idx] }}
        </view>
      </view> -->
        <slot></slot>
      </view>
    </view>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from "../baseLayout/baseLayout.vue";
import Header from "../../components/header/header.vue";
import StaticHeader from "../../components/header/staticHeader.vue";

import { onReady } from "@dcloudio/uni-app";
import { ref } from "vue";
import { linkTo } from "../../utils/fn";

const props = defineProps({
  useStaticHeader: {
    type: Boolean,
    default: false,
  },
  swiper_list: {
    type: Array,
    default: () => [],
  },
  broadcast_list: {
    type: Array,
    default: () => ["中航大校史馆入馆须知", "2023-10-01 最新公告"],
  },
  scrollTop: {
    type: Number,
    default: 0,
  },
});

const duration = 5000;
const broadcast_idx = ref(0);
const dots_active = ref();
const animation_data = ref({});

onReady(() => {
  dots_active.value = new Array(props.swiper_list.length).fill(false);
  dots_active.value[0] = true;
  init_broadcast();
});

const init_broadcast = () => {
  setInterval(() => {
    // 创建一个fade动画
    const animation = uni.createAnimation({
      duration: 500,
      timingFunction: "ease",
    });
    animation.opacity(0).step();
    animation_data.value = animation.export();
    setTimeout(() => {
      animation.opacity(1).step();
      animation_data.value = animation.export();
      broadcast_idx.value =
        (broadcast_idx.value + 1) % props.broadcast_list.length;
    }, 500);
  }, duration);
};

const swiperChange = (e) => {
  dots_active.value.forEach((item, idx) => {
    if (idx === e.detail.current) {
      dots_active.value[idx] = true;
    } else {
      dots_active.value[idx] = false;
    }
  });
};
</script>

<style lang="scss" scoped>
.main-content {
  --block-margin: 40px;
  height: 100vh;
  --common-radius: 10px;
  .swiper-container {
    position: sticky;
    top: 0;
    left: 0;
    // z-index: -1;
    .swiper-list {
      width: 100%;
      height: 45vh;
      .swiper-item {
        width: 100%;
        height: 100%;
        position: relative;
        .title {
          font-family: Georgia, serif;
          font-size: 18px;
          position: absolute;
          color: white;
          bottom: 12vh;
          left: 8vw;
          text-shadow: 1px 1px 2px black;
        }
        image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .swiper-dots {
      position: absolute;
      bottom: 8vh;
      left: 50%;
      transform: translateX(-50%);
      width: max-content;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .swiper-dot {
        width: 7px;
        height: 7px;
        border: 0.5px solid white;
        border-radius: 50%;
        transition: all 0.3s;
        &.active {
          background-color: #fefefe;
          border-color: #fefefe;
        }
        &:not(:last-child) {
          margin-right: 3px;
        }
      }
    }
  }
  .content {
    box-sizing: border-box;
    z-index: 2;
    height: max-content;
    background: #f8f3e8;
    position: relative;
    padding-inline: 20px;
    min-height: 55vh;
    padding-bottom: 20px;

    &::before {
      z-index: 99;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      transform: translateY(-99%);
      width: 100vw;
      height: 4vh;
      background-color: #f8f3e8;
      border-top-right-radius: 4vh;
      border-top-left-radius: 4vh;
    }

    .announcement {
      --broadcast-color: #5a4822;
      position: absolute;
      top: -5vh;
      left: 0;
      width: 100vw;
      height: 5vh;
      background-color: #f0eadd;
      border-top-left-radius: 4vh;
      border-top-right-radius: 4vh;
      box-sizing: border-box;
      padding-inline: 20px;
      display: flex;
      align-items: center;

      image {
        width: 20px;
        height: 20px;
        margin-right: 3vw;
      }
    }
  }
}
</style>
