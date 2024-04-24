<template>
  <SimpleLayout title="预订信息总览">
    <view class="section">
      <view class="title-ff"> 授权人姓名 </view>
      <view> {{ permission_name }} </view>
    </view>
    <view class="section">
      <view class="title-ff"> 授权人电话 </view>
      <view> {{ permission_tel }} </view>
    </view>
    <view class="section">
      <view class="title-ff"> 组织名称 </view>
      <view> {{ college }} </view>
    </view>
    <view class="section">
      <view class="title-ff"> 需要讲解员 </view>
      <view> {{ need ? "是" : "否" }} </view>
    </view>
    <view class="section" v-for="(item, idx) in size_list" :key="idx">
      <view class="title-ff">
        <view> 场次{{ idx + 1 }}人数 </view>
        <view class="time-desc">
          {{ "- 08:30-09:00 -" }}
        </view>
      </view>
      <view> {{ item }} 人</view>
    </view>
    <view class="section">
      <view class="title-ff"> 预订时间 </view>
      <view class="order-time-list">
        <view
          class="order-time-item"
          v-for="(item, idx) in choose_time_list"
          :key="idx"
        >
          <view>
            {{ item.split(" ")[0] }}
          </view>
          <view>
            {{ timeToFrame(item) }}
          </view>
        </view>
      </view>
    </view>
    <view class="section">
      <view class="title-ff"> 授权书类别 </view>
      <view> {{ pm_type == 0 ? "IMG" : "PDF" }} </view>
    </view>
    <view class="section">
      <view class="title-ff"> 授权书 </view>
      <view>
        <button class="picker-btn" @click="previewImg">预览授权书</button>
      </view>
    </view>
    <button class="next-step active" @click="submit_order">提交申请</button>
  </SimpleLayout>
</template>

<script setup>
import SimpleLayout from "../../layout/simpleLayout/simpleLayout.vue";

import { storeToRefs } from "pinia";
import { useCommonStore, useOrderStore } from "../../store";
import { RES_REQ_DURATION } from "../../utils/config/constants";
import { throttle } from "../../utils/fn";
import { timeToFrame } from "../../utils/fn/date";
import { sub_order } from "../../utils/http/order";

const orderStore = useOrderStore();
const commonStore = useCommonStore();
const {
  pm_type,
  img_url,
  pdf_url,
  permission_name,
  permission_tel,
  need,
  size_list,
  college,
  org_type,
  choose_time_list,
  choose_time_idx_list,
} = storeToRefs(orderStore);
const { loading } = storeToRefs(commonStore);

const previewImg = () => {
  uni.previewImage({
    current: 0,
    urls: [pm_type.value === 0 ? img_url.value : pdf_url.value],
  });
};

const submit_order = throttle(async () => {
  loading.value = true;
  await sub_order({
    permission_name: permission_name.value,
    permission_tel: permission_tel.value,
    organize: college.value,
    org_type: org_type.value,
    size_list: size_list.value.map((it) => parseInt(it)),
    time_list: choose_time_list.value,
    time_idx_list: choose_time_idx_list.value,
    need: need.value,
    sub_pm_type: pm_type.value === 0 ? "IMG" : "PDF",
    url: pm_type.value === 0 ? img_url.value : pdf_url.value,
  })
    .then((res) => {
      console.log(res);
      loading.value = false;
      orderStore.reset_order_data();
      uni.switchTab({
        url: "/pages/index/index",
      });
      if (res.statusCode === 201) {
        uni.showToast({
          title: "提交成功",
          icon: "none",
        });
      } else if (res.statusCode === 450) {
        uni.showToast({
          title: "用户已被封禁",
          icon: "none",
        });
      }
    })
    .catch((_) => {
      loading.value = false;
      orderStore.reset_order_data();
      uni.switchTab({
        url: "/pages/index/index",
      });
      uni.showToast({
        title: "提交失败",
        icon: "none",
      });
    });
}, RES_REQ_DURATION);
</script>

<style lang="scss" scoped>
.common-color {
  color: #5a4822;
}

.fade {
  opacity: 0.5;
  animation: fade 0.5s ease forwards;
  @keyframes fade {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
  }
}

.visit-title {
  font-size: 22px;
  font-weight: 600;
  color: #5a4822;
  box-sizing: border-box;
  padding-block: 2vh;
  border-bottom: 1px solid #e3dac8;
}
.section {
  display: grid;
  grid-template-columns: 30vw 1fr;
  align-items: center;
  padding-block: 2vh;
  border-bottom: 1px solid #e3dac8;
  .time-desc {
    font-size: 11px;
  }
  .order-time-list {
    display: grid;
    gap: 2vw;
    width: max-content;
    .order-time-item {
      box-sizing: border-box;
      width: 50vw;
      border: 1px solid #947f54;
      border-radius: 1vw;
      background-color: transparent;
      color: #b3a486;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      margin: 0;
      padding: 2vw;
      &:nth-child(2n + 1) {
        background-color: #947f54;
        color: #fffcf7;
      }
    }
  }
  .picker-btn {
    width: max-content;
    border: 1px solid #cebe9e;
    border-radius: 1vw;
    background-color: transparent;
    color: #b3a486;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    margin: 0;
  }
}

.next-step {
  margin-top: 4vw;
  border: none;
  width: 40vw;
  height: 7vh;
  background: #cebe9e;
  border-radius: 1vw;
  color: #fffcf7;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  font-weight: 600;
  font-size: 20px;

  &.active {
    opacity: 1;
  }
}
</style>
