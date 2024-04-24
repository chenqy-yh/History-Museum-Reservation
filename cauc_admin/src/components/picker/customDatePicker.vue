<template>
  <div class="container">
    <button
      class="common-button picker"
      :class="{
        'on-choose': show_picker,
      }"
      @click="onTogglePicker"
    >
      {{ "选择查询日期" }}
    </button>
    <Transition name="fade">
      <div class="date-picker" v-if="show_picker">
        <button class="common-button reset" @click="onReset">重置</button>
        <button class="common-button close" @click="onCancel">确认</button>
        <!-- header -->
        <div class="choose-date-header">
          <i class="ri-arrow-left-s-line ri-lg" @click="backMonth"></i>
          <div>{{ year }}-{{ month }}</div>
          <i class="ri-arrow-right-s-line ri-lg" @click="nextMonth"></i>
        </div>
        <!-- day-cols -->
        <div class="day-cols">
          <div v-for="(item, idx) in day_cols" :key="idx">{{ item }}</div>
        </div>
        <!-- day-list -->
        <div class="day-list">
          <div
            :class="{
              'day-list-item': item.day !== -1,
              active: choose_date_list.includes(item.date),
            }"
            v-for="(item, idx) in date_list"
            :key="idx"
            @click="onChooseDate(item)"
          >
            {{ item.day !== -1 ? item.day : "" }}
          </div>
        </div>
        <!-- choose list -->
        <div class="choose-list">
          <div class="title">选择的日期列表</div>
          <div class="list-area">
            <div
              v-for="(item, idx) in choose_date_list"
              :key="idx"
              class="common-button choose-item"
              @click="() => popChooseDate(idx)"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useOrderStoreForSetup, useHomeStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";

const orderStore = useOrderStoreForSetup();
const homeStore = useHomeStoreForSetup();
const { choose_date_list, show_order_setting_drawer } = storeToRefs(orderStore);
const { loading_order } = storeToRefs(homeStore);

const show_picker = ref(false);

const year = ref(2023);
const month = ref(10);

const day_cols = ["一", "二", "三", "四", "五", "六", "日"];
const date_list = ref<IDateItem[]>(
  Array.from({ length: 42 }, () => ({ day: -1, date: "" }))
);

// ------------------- C I R C L E ------------------- //

watch(
  () => show_order_setting_drawer.value,
  () => {
    if (!show_order_setting_drawer.value) {
      show_picker.value = false;
    }
  }
);

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
const onTogglePicker = () => {
  show_picker.value = !show_picker.value;
};

const onChooseDate = async (item: IDateItem) => {
  if (item.day !== -1) {
    // month不足2位补0 day 不足2位补0
    if (choose_date_list.value.includes(item.date)) {
      choose_date_list.value = choose_date_list.value.filter(
        (it) => it !== item.date
      );
    } else {
      choose_date_list.value.push(item.date);
    }
  }
};

const onReset = async () => {
  choose_date_list.value = [];
};

const onCancel = async () => {
  show_picker.value = false;
  loading_order.value = true;
  await orderStore.init();
  loading_order.value = false;
};

const nextMonth = () => {
  if (month.value === 12) {
    year.value += 1;
    month.value = 1;
  } else {
    month.value += 1;
  }
};

const backMonth = () => {
  if (month.value === 1) {
    year.value -= 1;
    month.value = 12;
  } else {
    month.value -= 1;
  }
};

const popChooseDate = (idx: number) => {
  choose_date_list.value.splice(idx, 1);
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.container {
  height: 100%;
  position: relative;
}
.picker {
  width: 150px;
  height: 100%;
  border-radius: 0;
  font-size: 16px;
  border-radius: 5px;
  color: #444;
  border-color: var(--button-border-light-color);
  &:hover {
    border-color: var(--common-color);
    color: var(--common-color);
    background-color: transparent;
  }
  &.on-choose {
    background-color: var(--common-color);
    color: #fff;
  }
}

.date-picker {
  user-select: none;
  z-index: 99999999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: max-content;
  // border: 1.5px solid var(--common-color);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

  background-color: #fefefe;
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;
  .reset {
    position: absolute;
    right: 20px;
    top: 20px;
    border-radius: var(--button-radius);
  }
  .close {
    position: absolute;
    left: 20px;
    top: 20px;
    border-radius: var(--button-radius);
  }
}
.choose-date-header {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--common-padding);
}
.day-cols {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
  align-items: center;
  height: 40px;
  border-block: 1.5px solid #eee;
}
.day-list {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
  align-items: center;
  .day-list-item {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    transition: var(--common-transition);
    &:hover {
      background-color: #f4f4f4;
      transition: var(--common-transition);
    }
    &.active {
      background-color: var(--common-color);
      color: #fff;
      transition: var(--common-transition);
      border: 1.5px solid var(--common-color);
      &:hover {
        background-color: #fefefe;
        color: var(--common-color);
        transition: var(--common-transition);
      }
    }
  }
}

.choose-list {
  .title {
    text-align: center;
    font-size: 16px;
    margin-bottom: 10px;
    border-block: 1.5px solid #eee;
    padding: var(--common-padding);
  }
  .list-area {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    justify-items: center;
    gap: var(--common-padding);
    .choose-item {
      width: max-content;
      border-radius: var(--button-radius);
    }
  }
}
</style>
