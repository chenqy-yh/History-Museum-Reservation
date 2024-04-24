<template>
  <SimpleLayout title="订单详情">
    <view class="section">
      <view class="title-ff"> 授权人姓名 </view>
      <view> {{ order.pm_name }} </view>
    </view>
    <view class="section">
      <view class="title-ff"> 授权人电话 </view>
      <view> {{ order.pm_tel }} </view>
    </view>
    <view class="section">
      <view class="title-ff"> 组织类型 </view>
      <view>
        {{ order.organize_tpye == "0" ? "在校人员" : "非在校人员" }}
      </view>
    </view>
    <view class="section">
      <view class="title-ff"> 组织名称 </view>
      <view> {{ order.organize }} </view>
    </view>
    <view class="section">
      <view class="title-ff"> 需要讲解员 </view>
      <view> {{ order.need == true ? "是" : "否" }} </view>
    </view>

    <view class="section" v-for="(item, idx) in order.orderItems" :key="idx">
      <view class="title-ff">
        <view> {{ `场次${idx + 1}人数` }} </view>
        <view class="time-desc">
          {{ `- ${timeToFrameForDateStr(item.order_time)} -` }}
        </view>
      </view>

      <view> {{ item.size }}人 </view>
    </view>
    <view class="section">
      <view class="title-ff"> 预订时间 </view>
      <view class="order-time-list">
        <view
          class="order-time-item"
          v-for="(item, idx) in time_list"
          :key="idx"
        >
          <view>
            {{ item.split(" ")[0] }}
          </view>
          <view>
            {{ timeToFrameForDateStr(item) }}
          </view>
        </view>
      </view>
    </view>
    <view class="section">
      <view class="title-ff"> 授权书类别 </view>
      <view> {{ order.sub_pm_type }} </view>
    </view>
    <view class="section">
      <view class="title-ff"> 授权书 </view>
      <view>
        <button class="picker-btn" @click="previewImg">预览授权书</button>
      </view>
    </view>
    <view class="section">
      <view class="title-ff"> 操作状态 </view>
      <view> {{ operate_status_desc }} </view>
    </view>
    <view class="section">
      <view class="title-ff"> 订单状态 </view>
      <view> {{ order_status_desc }} </view>
    </view>
    <view class="section">
      <view class="title-ff"> 订单异常 </view>
      <view> {{ order_error_desc }} </view>
    </view>
    <button
      class="cancel-order-btn"
      @click="cancelOrder"
      v-if="order.operate_status == OperateStatusEnum.UNSOLVE"
    >
      取消预订
    </button>
  </SimpleLayout>
  <MessageBox v-model="show_msg_box" :mask-close="false">
    <view class="confirm-msg-box">
      <view class="title"> 温馨提示 </view>
      <view class="content">
        当前用户取消订单次数:<text class="red">{{
          user_cancel_order_times
        }}</text
        ><br />
        用户每个月只能取消<text class="red">两次</text>订单<br />
        超过当天取消视为<text class="red">失约</text><br />
        您确定要<text class="red">取消</text>吗？
      </view>
      <view class="btn-group">
        <button
          class="btn confirm"
          :class="{ active: able_use_confirm_btn }"
          @click="cancelOrderConfirm"
        >
          {{ confirm_button_label }}
          {{ remainingTime ? `${remainingTime}秒` : "" }}
        </button>
      </view>
      <img
        src="/static/img/icon/close.png"
        class="close"
        @click="cancelOrderCancel"
      />
    </view>
  </MessageBox>
</template>

<script setup>
import SimpleLayout from "../../layout/simpleLayout/simpleLayout.vue";
import MessageBox from "../../components/messageBox/messageBox.vue";
import CToast from "../../utils/fn/toast";

import { ref, computed } from "vue";
import { onReady } from "@dcloudio/uni-app";
import {
  formatTime_YYYYMMDD_HHMM,
  timeToFrameForDateStr,
} from "../../utils/fn";
import { cancel_order } from "../../utils/api/order";
import { useOrderStore } from "../../store";
import { storeToRefs } from "pinia";
import {
  OperateStatusEnum,
  OperateStatusType,
  OrderErrorStatusType,
  OrderStatusType,
  OrderType,
} from "../../utils/enum";
import { getUserCancelTimes as _getUserCancelTimes } from "../../utils/api/user";

// -------------------- S T O R E -------------------- //
const orderStore = useOrderStore();
const { choose_order_detail } = storeToRefs(orderStore);

// ------------------- C O M M O N ------------------- //
// 展示订单
const order = ref({});
// 操作状态描述
const operate_status_desc = ref("");
// 订单状态描述
const order_status_desc = ref("");
// 订单异常描述
const order_error_desc = ref("");
// 展示取消订单提示框
const show_msg_box = ref(false);
// 是否可以使用确认按钮
const able_use_confirm_btn = ref(false);
// 确认按钮文字
const confirm_button_label = ref("确认");
// 剩余时间
const remainingTime = ref(0);
// 用户取消订单次数
const user_cancel_order_times = ref(0);
// 取消订单定时器
let cancel_order_timer;
// 时间列表
const time_list = computed(() => {
  return (
    order.value.orderItems &&
    order.value.orderItems.map((it) => formatTime_YYYYMMDD_HHMM(it.order_time))
  );
});

// ------------------- C I R C L E ------------------- //

// 加载数据
onReady(() => {
  order.value = choose_order_detail.value;
  operate_status_desc.value = OperateStatusType[order.value.operate_status];
  order_status_desc.value = OrderStatusType[order.value.order_status];
  order_error_desc.value = OrderErrorStatusType[order.value.error_status];
  getUserCancelOrderTimes();
});

// ----------------- F U N C T I O N ----------------- //

/**
 * 获得用户一个月内取消订单次数
 *
 */
const getUserCancelOrderTimes = async () => {
  user_cancel_order_times.value = (await _getUserCancelTimes()).data;
};

/**
 * 预览授权书
 *
 */
const previewImg = () => {
  uni.previewImage({
    current: 0,
    urls: [order.value.verify_url],
  });
};

/**
 *取消订单
 *
 * */
const cancelOrder = async () => {
  const gap = 5000;
  const startTimer = () => {
    let seconds = gap / 1000;
    cancel_order_timer = setInterval(() => {
      remainingTime.value = seconds;
      if (remainingTime.value === gap / 1000) show_msg_box.value = true;
      seconds--;
      if (seconds < 0) {
        clearInterval(cancel_order_timer);
        able_use_confirm_btn.value = true;
        remainingTime.value = 0;
      }
    }, 1000);
  };
  startTimer();
};

/**
 * 取消   取消订单
 * */
const cancelOrderCancel = () => {
  clearInterval(cancel_order_timer);
  show_msg_box.value = false;
  able_use_confirm_btn.value = false;
  remainingTime.value = 0; // 重置剩余时间
};

/**
 * 确认   取消订单
 *
 */
const cancelOrderConfirm = () => {
  if (!able_use_confirm_btn.value) return;
  clearInterval(cancel_order_timer);
  cancel_order(order.value.id)
    .then((res) => {
      if (res.statusCode === 201) {
        CToast.success("订单已取消");
      } else {
        CToast.error("订单取消失败");
      }
    })
    .catch((err) => {
      console.log("cancel order fail:", err);
      CToast.error("订单取消失败");
    })
    .finally(() => {
      show_msg_box.value = false;
      able_use_confirm_btn.value = false;
      remainingTime.value = 0; // 重置剩余时间
      uni.navigateBack();
    });
};
</script>

<style lang="scss" scoped>
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

.confirm-msg-box {
  display: grid;
  gap: 4vh;
  position: relative;
  .title {
    font-size: 20px;
    text-align: center;
    font-weight: 600;
    color: #5a4822;
  }
  .content {
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    color: #5a4822;
    .red {
      color: red;
    }
  }
  .btn-group {
    display: grid;
    grid-template-columns: 1fr;
    .btn {
      background-color: transparent;
      padding: 0;
      height: 30px;
      line-height: 30px;
      margin: 0;
      // box-sizing: border-box;
      &.confirm {
        background-color: #5a4822;
        color: #fff;
        opacity: 0.5;
        &.active {
          opacity: 1;
        }
      }
      &.cancel {
        border: 1px solid #5a4822;
      }
    }
  }
  .close {
    width: 5vw;
    height: 5vw;
    position: absolute;
    top: 0;
    right: 0;
  }
}

.section {
  display: grid;
  grid-template-columns: 30vw 1fr;
  align-items: center;
  padding-block: 2vh;
  border-bottom: 1px solid #e3dac8;

  .order-time-list {
    display: grid;
    gap: 2vw;
    width: max-content;
  }
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
  .time-desc {
    font-size: 11px;
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

.cancel-order-btn {
  width: 70vw;
  height: 10vw;
  background-color: #fff0d3;
  border-radius: 2vw;
  color: #5a4822;
  font-size: 15px;
  margin: 0 auto;
  margin-block: 5vh;
  border: none;
  outline: none;
  box-shadow: 0 0 10px #ddd8cd;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
</style>
