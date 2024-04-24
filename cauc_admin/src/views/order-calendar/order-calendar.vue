<template>
  <div class="_outer">
    <div class="main-content">
      <div class="header">
        <div class="back-this-month">
          <IconButton theme="light" text="回到本月"></IconButton>
        </div>
        <!-- <button @click="goBackCurMonth" class="common-button ">
          回到本月
        </button> -->
        <i class="ri-arrow-left-s-line ri-lg btn" @click="lastMonth"></i>
        <div>{{ year }}-{{ month }}</div>
        <i class="ri-arrow-right-s-line ri-lg btn" @click="nextMonth"></i>
      </div>

      <div class="day-cols">
        <div v-for="(item, idx) in day_cols" :key="idx">{{ item }}</div>
      </div>
      <div class="day-list">
        <div
          class="common-item"
          :class="{
            'day-list-item': item.day !== -1,
          }"
          v-for="(item, idx) in date_list"
          :key="idx"
          @click="() => onChooseDate(item)"
        >
          {{ item.day !== -1 ? item.day : "" }}
        </div>
      </div>
    </div>
    <el-drawer
      :withHeader="false"
      v-model="show_drawer"
      :direction="'rtl'"
      size="600px"
    >
      <Transition name="fade" mode="out-in">
        <component :is="drawer_component"></component>
      </Transition>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import RecordDetail from "./components/record-detail.vue";
import IconButton from "@/components/button/iconButton.vue";

import { useOrderCalendarStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { ref, shallowRef, watch } from "vue";

// -------------------- S T O R E -------------------- //

const order_calendar_store = useOrderCalendarStoreForSetup();
const { show_drawer, drawer_component, drawer_title } =
  storeToRefs(order_calendar_store);

// ----------------- C O N S T A N T ----------------- //

const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth() + 1);

const show_date_info = ref(false);

const day_cols = ["一", "二", "三", "四", "五", "六", "日"];
const date_list = ref<IDateItem[]>(
  Array.from({ length: 42 }, () => ({ day: -1, date: "" }))
);

// ------------------- C I R C L E ------------------- //

watch(
  () => year.value + "-" + month.value,
  () => {
    date_list.value = Array.from({ length: 42 }, () => ({ day: -1, date: "" }));
    // 根据year 和 month 计算出当月的天数
    const firstDay = new Date(year.value, month.value - 1, 1);
    const days = new Date(year.value, month.value, 0).getDate();
    const st = (firstDay.getDay() + 6) % 7;
    for (let i = 0; i < days; i++) {
      date_list.value[st + i] = {
        day: i + 1,
        date: `${year.value}-${month.value.toString().padStart(2, "0")}-${(
          i + 1
        )
          .toString()
          .padStart(2, "0")}`,
      };
    }
  },
  { immediate: true }
);

// ----------------- F U N C T I O N ----------------- //

const onChooseDate = async (item: IDateItem) => {
  if (item.day == -1) {
    return;
  }
  show_date_info.value = true;
  await order_calendar_store.getRecordByDate(item.date);
  drawer_component.value = RecordDetail;
  // drawer_title.value = "记录详情";
  show_drawer.value = true;
};

const nextMonth = () => {
  if (month.value === 12) {
    year.value++;
    month.value = 1;
  } else {
    month.value++;
  }
};

const lastMonth = () => {
  if (month.value === 1) {
    year.value--;
    month.value = 12;
  } else {
    month.value--;
  }
};

const goBackCurMonth = () => {
  year.value = new Date().getFullYear();
  month.value = new Date().getMonth() + 1;
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: var(--common-transition);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.date-info-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--common-padding);
  .record-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .time-cap {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--common-padding);
    .time-cap-item {
      border: 1px solid #eee;
      height: 80px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      .cap {
        font-size: 26px;
        font-weight: bold;
      }
      .time {
        font-size: 14px;
        color: #888;
      }
      &.full {
        .cap {
          color: rgb(255, 0, 0);
        }
        &::before {
          content: "FULL";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: rgb(255, 219, 219);
          font-size: 30px;
          z-index: -1;
        }
      }
    }
  }
}

.no-date-info {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

._outer {
  height: 100%;
}
.main-content {
  background-color: #fefefe;
  height: 100%;
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  padding: var(--common-padding);
  gap: 10px;

  .header {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    font-size: 32px;
    position: relative;
    .back-this-month {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    .btn {
      cursor: pointer;
    }
  }
  .day-cols {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    justify-items: center;
    align-items: center;
    height: 40px;
    border-block: 1px solid #eeeeee;
  }

  .choose-date {
    // border: 1px solid red;
    width: max-content;
    display: grid;
    grid-template-columns: 150px 1fr;
    align-items: center;
  }
  .day-list {
    // border: 1px solid red;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    justify-items: center;
    align-items: center;
    border-top: 1px solid #eee;
    border-left: 1px solid #eee;
    .common-item {
      width: 100%;
      height: 100%;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
    .day-list-item {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      transition: var(--common-transition);

      &:hover {
        background-color: #f4f4f4;
        transition: var(--common-transition);
      }
    }
  }
}
</style>
