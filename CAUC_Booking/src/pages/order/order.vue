<template>
  <view>
    <IndexLayout :swiper_list="swaper_list" :use-static-header="true">
      <view class="content">
        <view class="top-title title-ff"> 中国民航大学校史馆 </view>
        <view class="date-tip">
          开馆时间: 08:30 | 闭馆时间: 16:30 | 每周六，日闭馆
        </view>
        <view class="block-list">
          <view
            class="group-order"
            @click="linkTo('/pages/order/order_date_time', false, true)"
          >
            <image src="/static/img/order1.jpg" mode="aspectFill"></image>
            <LinkButton
              text="团队预约"
              :content-style="{
                fontSize: '18px',
                width: '24vw',
              }"
              class="title-ff"
            ></LinkButton>
          </view>
        </view>
      </view>
    </IndexLayout>
  </view>
</template>

<script setup>
import { ref } from "vue";
import IndexLayout from "../../layout/indexLayout/indexLayout.vue";
import LinkButton from "../../components/linkButton/linkButton.vue";
import { onReady } from "@dcloudio/uni-app";
import { linkTo } from "../../utils/fn/index";

const swaper_list = ref([
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
</script>

<style lang="scss" scoped>
.content {
  padding-block: 20px;
  .top-title {
    font-weight: 600;
    font-size: 22px;
    color: #5a4822;
  }
  .date-tip {
    font-size: 13px;
    color: #82775f;
    margin-top: 10px;
  }
  .block-list {
    margin-top: 20px;
    .group-order {
      z-index: 9999;
      width: 70vw;
      aspect-ratio: 4/1.8;
      color: #5a4822;
      position: relative;
      display: flex;
      background-color: #fff0d3;
      box-sizing: border-box;
      padding-left: 5%;
      padding-top: 5%;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      image {
        position: absolute;

        width: 100%;
        height: 100%;
        top: 50%;
        left: 0;
        filter: brightness(1);
      }
      .title {
        position: relative;
        font-weight: 600;
        font-size: 20px;
        margin-top: 5%;
        margin-left: 5%;
      }
    }
    // .group-order {
    //   width: 100%;
    //   height: 80px;
    //   color: #5a4822;
    //   position: relative;
    //   z-index: -1;
    //   display: flex;
    //   overflow: hidden;
    //   background-color: #fff0d3;
    //   box-sizing: border-box;
    //   padding-left: 10%;
    //   padding-top: 5%;
    //   border-radius: 10px;
    //   overflow: hidden;
    //   box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    //   image {
    //     position: absolute;

    //     width: 100%;
    //     height: 100%;
    //     top: 50%;
    //     left: 0;
    //     z-index: -1;
    //     filter: brightness(1);
    //   }
    //   .title {
    //     position: relative;
    //     font-weight: 600;
    //     font-size: 20px;
    //     margin-top: 5%;
    //     margin-left: 5%;
    //   }
    // }
  }
}
</style>
