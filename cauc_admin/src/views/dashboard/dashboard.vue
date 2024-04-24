<template>
  <div class="main-content">
    <!-- data -->
    <div class="main-title">数据查询</div>
    <div class="module-area">
      <div class="block" v-for="(item, idx) in data_block" :key="idx">
        <div class="icon">
          <i class="ri-shopping-cart-fill ri-2x"></i>
        </div>
        <div class="detail">
          <div class="val">{{ item.value }}</div>
          <div class="title">{{ item.title }}</div>
        </div>
      </div>
    </div>
    <!-- function -->
    <div class="main-title">功能</div>
    <div class="module-area">
      <div
        class="block"
        v-for="(item, idx) in function_block"
        :key="idx"
        @click="linkTo(item.name)"
      >
        <div class="icon">
          <i class="ri-shopping-cart-fill ri-2x"></i>
        </div>
        <div class="detail">
          <div class="single-title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { router } from "@/router";
import {
getOrderCountByCreateAt
} from "@/utils/api/order";
import { onMounted, ref } from "vue";

const order_count_today = ref();

const data_block = ref([
  {
    title: "今日订单",
    value: order_count_today,
  },
]);

const function_block = ref([
  {
    title: "订单管理",
    name: "Order",
  },
  {
    title: "订单日历",
    name: "OrderCalendar",
  },
  {
    title: "预订详情",
    name: "Detail",
  },
]);

onMounted(async () => {
  // 获得今日日期 yyyy-mm-dd
  const today = new Date().toLocaleDateString().replace(/\//g, "-");
  console.log("today:", today);

  order_count_today.value = (await getOrderCountByCreateAt(today)).data;

  console.log(router.getRoutes());

});

const linkTo = (name: string) => {
  router.push({ name });
};
</script>

<style lang="scss" scoped>
.main-content {
  background-color: var(--bg-primary-color);
  height: 100%;
  padding-inline: var(--common-padding);
  display: flex;
  flex-direction: column;
  gap: var(--common-padding-2);
  .main-title {
    font-size: 32px;
    border-bottom: 1.5px solid #eee;
    padding-block: var(--common-padding);
  }
  .module-area {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(300px, calc(100% / 4 - var(--common-padding) * 3 / 4))
    );
    gap: var(--common-padding);

    .block {
      // border: 1px solid red;
      width: 280px;
      aspect-ratio: 4/2.5;
      padding: 20px;
      font-size: 20px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      border-radius: var(--common-radius);
      position: relative;
      display: grid;
      grid-template-columns: max-content 1fr;
      align-items: center;
      transition: var(--common-transition);
      cursor: pointer;
      .icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--common-color);
        color: #fefefe;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          width: 110%;
          height: 110%;
          border-radius: 50%;
          border: 1.5px solid var(--common-color);
        }
      }
      .detail {
        height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .val {
          font-size: 36px;
          font-weight: 600;
          color: var(--common-color);
        }
        .title {
          font-size: 16px;
        }
        .single-title {
          font-size: 32px;
        }
      }
      &:hover {
        background-color: var(--common-color);
        .icon {
          background-color: #fefefe;
          color: var(--common-color);
          &::before {
            border: 1.5px solid #fefefe;
          }
        }
        .detail {
          .val {
            color: #fefefe;
          }
          .title {
            color: #fefefe;
          }
          .single-title {
            color: #fefefe;
          }
        }
      }
    }
  }
  .order-detail {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(100px, calc(100% / 6 - var(--common-padding) * 5 / 6))
    );
    gap: var(--common-padding);
    .month-block {
      aspect-ratio: 4/2.5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
  }
}
</style>
