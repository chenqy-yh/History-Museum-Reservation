<template>
  <IndexLayout :swiper_list="index_swaper_list" :scroll-top="scrollTop">
    <SmallBlockList :small_block_list="small_block"></SmallBlockList>
    <view class="history-block">
      <view class="title title-ff">校园历史</view>
      <scroll-view scroll-x="true" class="scroll-view">
        <view
          v-for="(item, idx) in history_list"
          :key="idx"
          class="scroll-item"
        >
          <image mode="aspectFill" :src="item.url" webp="true"></image>
          <view class="block-title">{{ `校园历史${idx}` }}</view>
        </view>
      </scroll-view>
    </view>
    <view class="culture-block">
      <view class="title title-ff"> 文化创新 </view>
      <view class="block-list">
        <view v-for="(item, idx) in culture_list" :key="idx" class="block-item">
          <image mode="aspectFill" :src="item.url" webp="true"></image>
          <view class="block-title">{{ item.title }}</view>
          <view class="author">{{ item.author }}</view>
        </view>
      </view>
    </view>
  </IndexLayout>
</template>

<script setup>
import SmallBlockList from "../../components/smallBlockList/smallBlockList.vue";
import IndexLayout from "../../layout/indexLayout/indexLayout.vue";

import { onPageScroll } from "@dcloudio/uni-app";
import { ref } from "vue";


const scrollTop = ref(0);

const index_swaper_list = ref([
  {
    title: "中国民航大学校史馆1",
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/index_swaper_1.jpg",
    active: true,
  },
  {
    title: "中国民航大学校史馆2",
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/index_swaper_2.jpg",
    active: false,
  },
  {
    title: "中国民航大学校史馆3",
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/index_swaper_3.jpg",
    active: false,
  },
  {
    title: "中国民航大学校史馆4",
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/index_swaper_4.jpg",
    active: false,
  },
  {
    title: "中国民航大学校史馆5",
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/index_swaper_5.jpg",
    active: false,
  },
  {
    title: "中国民航大学校史馆6",
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/index_swaper_6.jpg",
    active: false,
  },
]);

const small_block = ref([
  {
    url: "/static/img/icon/museum.png",
    name: "展馆预定",
    linkTo: "/pages/order/order",
    isTabbar: false,
  },
  {
    url: "/static/img/icon/guide.png",
    name: "参观指南",
    linkTo: "/pages/guide/guide",
    isTabbar: false,
  },
  {
    url: "/static/img/icon/notice.png",
    name: "入馆须知",
    linkTo: "/pages/notice/notice",
    isTabbar: false,
  },
]);

const history_list = [
  {
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/history_1.webp",
  },
  {
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/culture_2.webp",
  },
];

const culture_list = [
  {
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/culture_1.webp",
    title: "文化创新1",
    author: "中航大校史馆",
  },
  {
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/culture_2.webp",
    title: "文化创新2",
    author: "中航大校史馆",
  },
];

onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

</script>

<style lang="scss" scoped>
.history-block {
  // border: 1px solid red;
  margin-bottom: var(--block-margin);
  .title {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 20px;
  }
  .scroll-view {
    width: 100%;
    white-space: nowrap;
    .scroll-item {
      width: 38vw;
      height: 38vw;
      display: inline-block;
      // 选择除了最后一个元素的所有元素
      &:not(:last-child) {
        margin-right: 10px;
      }
      image {
        width: 100%;
        height: 100%;
        border-radius: var(--common-radius);
      }
      .block-title {
        text-align: center;
        color: #322e24;
      }
    }
  }
}
.culture-block {
  .title {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 20px;
  }
  .block-list {
    --block-size: calc((100vw - 60px) / 2);
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(2, var(--block-size));
    gap: 20px;

    .block-item {
      image {
        width: var(--block-size);
        // height: var(--block-size);
        border-radius: var(--common-radius);
      }
      .block-title {
        font-size: 16px;
        margin-top: 5px;
      }
      .author {
        font-size: 11px;
        color: #7f755d;
      }
    }
  }
}
</style>
