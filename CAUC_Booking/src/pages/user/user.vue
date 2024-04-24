<template>
  <view>
    <CommonLayout
      bg_url="https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/index_swaper_1.jpg"
      title="个人中心"
      :use-static-header="true"
    >
      <view class="content">
        <!-- 登陆 -->
        <view class="user-info-block login" @click="login" v-if="!login_status">
          <image src="/static/img/icon/login.png" mode="aspectFit"> </image>
          <view class="tip title-ff"> 请点击登陆 </view>
        </view>
        <view class="user-info-block" v-else>
          <image :src="avatar" mode="aspectFit"> </image>
          <view class="tip title-ff"> {{ nickname }} </view>
        </view>
        <view class="block-list" v-if="login_status">
          <!-- 我的订单 -->
          <view
            class="block-item"
            @click="linkTo('/pages/order/order_status', true)"
          >
            <view class="item-right">
              <image src="/static/img/icon/order.png" mode="aspectFit"> </image>
              <view class="title title-ff"> 我的订单 </view>
            </view>
            <view class="item-left">
              <image mode="aspectFit" src="/static/img/icon/right.png"></image>
            </view>
          </view>
          <!-- 退出登陆 -->
          <view class="block-item" @click="logout">
            <view class="item-right">
              <image src="/static/img/icon/logout.png" mode="aspectFit">
              </image>
              <view class="title title-ff"> 退出登陆 </view>
            </view>
            <view class="item-left">
              <image mode="aspectFit" src="/static/img/icon/right.png"></image>
            </view>
          </view>
        </view>
      </view>
    </CommonLayout>
  </view>
</template>

<script setup>
import CommonLayout from "../../layout/commonLayout/commonLayout.vue";
import CToast from "../../utils/fn/toast";

import { storeToRefs } from "pinia";
import { useUserStore, useCommonStore } from "../../store";
import { linkTo } from "../../utils/fn/index";

const userStore = useUserStore();
const commonStore = useCommonStore();

const { loading } = storeToRefs(commonStore);
const { nickname, avatar, login_status } = storeToRefs(userStore);

const block_list = [
  {
    title: "我的订单",
    icon: "/static/img/icon/order.png",
    url: "/pages/order/order_status",
  },
  {
    title: "退出登陆",
    icon: "/static/img/icon/logout.png",
    cb: () => {
      userStore.logout();
    },
  },
];

const login = () => {
  loading.value = true;
  userStore
    .login()
    .then((res) => {
      CToast.success("登陆成功", 1500);
    })
    .catch((err) => {
      CToast.error("登陆失败", 1500);
    })
    .finally(() => {
      loading.value = false;
    });
};

const logout = () => {
  userStore.logout();
  CToast.error("您已退出登陆", 1500);
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  // border: 1px solid red;
  .user-info-block {
    display: flex;
    align-items: center;
    padding: 2vw;
    border-radius: 2vw;

    &.login {
      box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
        rgb(209, 213, 219) 0px 0px 0px 1px inset;
    }

    image {
      width: 15vw;
      height: 15vw;
    }
    .tip {
      margin-left: 5vw;
      font-size: 20px;
      font-weight: 600;
    }
  }
  .block-list {
    margin-top: 5vh;
    .block-item {
      display: flex;
      align-items: center;
      padding-block: 2vh;
      border-bottom: 1px solid #bdb39e;
      .item-right {
        display: flex;
        align-items: center;
        image {
          width: 5vw;
          height: 5vw;
          margin-right: 3vw;
        }
        .title {
          font-weight: 600;
        }
      }
      .item-left {
        margin-left: auto;
        image {
          width: 5vw;
          height: 5vw;
        }
      }
    }
  }
}
</style>
