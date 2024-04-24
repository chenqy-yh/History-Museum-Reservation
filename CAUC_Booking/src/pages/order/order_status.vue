<template>
  <SimpleLayout title="订单">
    <view class="container" v-if="login_status">
      <view class="status-list">
        <view
          class="status-item title-ff"
          :class="{
            active: item.active,
          }"
          v-for="(item, idx) in status_list"
          :key="idx"
          @click="() => selectStatus(idx)"
        >
          {{ item.title }}
        </view>
        <view
          class="line"
          :style="{
            left: line_move_list[status_list.findIndex((item) => item.active)],
          }"
        >
        </view>
      </view>
      <view class="order-list">
        <image
          class="bg-img"
          src="/static/img/icon/sad.png"
          mode="aspectFit"
          :style="{
            opacity: mul_status_order_list[active_idx].length === 0 ? 1 : 0,
          }"
        >
        </image>
        <view
          class="order-item title-ff"
          v-for="(item, idx) in mul_status_order_list[active_idx]"
          :key="idx"
          @click="() => catOrderDetail(item)"
        >
          <view> 订单号：{{ item.id }} </view>
          <view>
            <view> 预订人:{{ item.pm_name }} </view>
          </view>
          <view>
            <view> 日期：{{ item.order_date }} </view>
          </view>
        </view>
      </view>
      <view class="bottom-tip" v-if="show_pulldown_refresh">
        <image src="/static/img/icon/up.png"></image>
        <view class="tip"> 向上滑动刷新更多 </view>
      </view>
    </view>
    <view class="login-warning title-ff" v-else> 请先登陆 </view>
  </SimpleLayout>
</template>

<script setup>
import SimpleLayout from "../../layout/simpleLayout/simpleLayout.vue";
import CToast from "../../utils/fn/toast";

import { onPullDownRefresh, onShow, onReady } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useCommonStore, useUserStore, useOrderStore } from "../../store";
import { formatTime_YYYYMMDD_HHMM } from "../../utils/fn";
import { redirectTo } from "../../utils/fn/index";
import { OperateStatusEnum } from "../../utils/enum/index";

// -------------------- S T O R E -------------------- //

const userStore = useUserStore();
const commonStore = useCommonStore();
const orderStore = useOrderStore();
const { choose_order_detail } = storeToRefs(orderStore);
const { login_status } = storeToRefs(userStore);
const { loading } = storeToRefs(commonStore);

// ----------------- C O N S T A N T ----------------- //

const show_pulldown_refresh = ref(false);

const status_list = ref([
  {
    title: "待审核",
    active: true,
  },
  {
    title: "已审核",
    active: false,
  },
]);

const order_status_size = 4;
const line_move_list = ["18vw", "64vw"];
const active_idx = ref(0);

const mul_status_order_list = ref(
  Array.from({ length: order_status_size }, () => [])
);

// ------------------- C I R C L E ------------------- //

watch(
  () => status_list.value,
  (val) => {
    active_idx.value = val.findIndex((item) => item.active);
  },
  {
    immediate: true,
    deep: true,
  }
);

onShow(async () => {
  await getOrderList();
});

onPullDownRefresh(async () => {
  show_pulldown_refresh.value = false;
  await getOrderList();
  show_pulldown_refresh.value = true;
});

// ----------------- F U N C T I O N ----------------- //

// 选择状态
const selectStatus = (i) => {
  status_list.value.forEach((item, idx) => {
    if (idx === i) {
      item.active = true;
    } else {
      item.active = false;
    }
  });
};

// 获取订单列表
const getOrderList = async () => {
  return new Promise((resolve, reject) => {
    if (login_status.value) {
      userStore
        .getOrdersByOpenid()
        .then((res) => {
          resetMulStatusOrderList();
          if (res.data.length === 0) {
            CToast.error("暂无订单");
            resolve();
            return;
          }
          const order_list = res.data.reverse();

          order_list.forEach((item) => {
            switch (item.operate_status) {
              case OperateStatusEnum.UNSOLVE:
                mul_status_order_list.value[OperateStatusEnum.UNSOLVE].push(
                  item
                );
                break;
              case OperateStatusEnum.SOLVE:
                mul_status_order_list.value[OperateStatusEnum.SOLVE].push(item);
                break;
              default:
                // other
                mul_status_order_list.value[2].push(item);
                break;
            }
          });
          resolve();
        })
        .catch((err) => {
          console.log(err);
          CToast.error("订单数据加载失败", 1500);
          reject(err);
        })
        .finally(() => {
          uni.stopPullDownRefresh();
        });
    }
  });
};

// 重置订单列表
const resetMulStatusOrderList = () => {
  mul_status_order_list.value = Array.from(
    { length: order_status_size },
    () => []
  );
};

// 查看订单详情
const catOrderDetail = (order) => {
  choose_order_detail.value = order;
  uni.navigateTo({
    url: `/pages/order/order_detail`,
  });
  // redirectTo("/pages/order/order_detail", order);
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 80vh;
  display: grid;
  grid-template-rows: 3.5vh 1fr;
  .status-list {
    display: flex;
    justify-content: space-around;
    // border: 1px solid red;
    position: relative;
    .status-item {
      color: #5a4822;
      font-size: 15px;
      width: 14vw;
      text-align: center;
      //   border: 1px solid red;
    }
    .line {
      position: absolute;
      bottom: 0;
      //   left: 8.5vw;
      width: 10vw;
      height: 2px;
      background-color: #a8a296;
      transition: all 0.3s;
    }
  }
  .order-list {
    position: relative;
    // border: 1px solid red;
    padding-block: 2vh;
    display: flex;
    flex-direction: column;
    .bg-img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 30vw;
      height: 30vw;
      z-index: 0;
      transition: all 0.3s;
    }
    .order-item {
      //   background-color: #ffffff;
      background: linear-gradient(45deg, #fffcf7, #e1dcd4);
      color: #5a4822;
      filter: brightness(1);
      // border: 1px solid red;
      padding: 2vw;
      border-radius: 2vw;
      font-size: 15px;
      //   box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 4px,
        rgba(0, 0, 0, 0.23) 0px 3px 4px;
      &:not(:last-child) {
        margin-bottom: 2vh;
      }
    }
  }
}

.login-warning {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
}

.bottom-tip {
  padding-top: 40px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #b4a481;
  image {
    position: absolute;
    top: 10%;
    width: 30px;
    height: 30px;
    animation: move 2s infinite;
    @keyframes move {
      from {
        opacity: 0;
        transform: translateY(0);
      }
      30%,
      50% {
        opacity: 0.7;
        transform: translateY(-20%);
      }
      to {
        opacity: 0;
        transform: translateY(-40%);
      }
    }
  }
}
</style>
