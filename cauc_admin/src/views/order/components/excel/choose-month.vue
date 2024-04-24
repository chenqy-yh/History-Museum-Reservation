<template>
  <div class="main-content">
    <el-page-header @back="backStep">
      <template #content>
        <span class="text-large font-600 mr-3"> 选择导出月份 </span>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button @click="toggleShow">{{
            show_calendar ? "查看月份列表" : "查看日历"
          }}</el-button>
          <el-button @click="nextStep" type="primary">导出Excel</el-button>
        </div>
      </template>
    </el-page-header>
    <div class="choose-month-content">
      <TransitionGroup name="fade">
        <div class="choose-month-block" v-if="show_calendar">
          <MonthPicker></MonthPicker>
        </div>
        <div class="month-list" v-else>
          <div class="sub-title">日期列表</div>
          <div class="choose-month-list">
            <TransitionGroup name="fade">
              <el-tag
                v-for="item in choose_month_list"
                :key="item"
                closable
                type="info"
                size="large"
                @close="() => delMonth(item)"
              >
                {{ item }}
              </el-tag>
            </TransitionGroup>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import MonthPicker from "@/components/picker/monthPicker.vue";

import { useExcelStoreForSetup } from "@/store";
import { CalendarDateType, CalendarInstance } from "element-plus";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

interface DateCeil {
  date: Date;
  day: string;
  isSelected: boolean;
  type: string;
}

// -------------------- S T O R E -------------------- //

const excelStore = useExcelStoreForSetup();
const { active_step, choose_month_list } = storeToRefs(excelStore);

// ----------------- C O N S T A N T ----------------- //

const show_calendar = ref(true);
const year = ref(new Date().getFullYear());

// ------------------- C I R C L E ------------------- //

// ----------------- F U N C T I O N ----------------- //

const nextStep = () => {
  active_step.value = 3;
};
const backStep = () => {
  active_step.value = 1;
};

const toggleShow = () => {
  show_calendar.value = !show_calendar.value;
};

const delMonth = (month: string) => {
  choose_month_list.value = choose_month_list.value.filter(
    (it) => it !== month
  );
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

.date-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--common-transition);
  color: black;
  &.choose-day {
    color: var(--common-color);
    font-size: 24px;
  }
}
.choose-month-list {
  display: flex;
  gap: var(--common-padding);
  flex-wrap: wrap;
}

.main-content {
  display: grid;
  grid-template-rows: max-content 1fr;
  gap: 30px;
  .choose-month-content {
    // border: 1px solid red;
    height: 75vh;
    overflow-y: auto;
    position: relative;
    .choose-month-block {
      position: absolute;
      width: 100%;
    }

    .month-list {
      position: absolute;
    }

    .sub-title {
      font-size: 20px;
      margin-bottom: var(--common-padding);
      padding-bottom: var(--common-padding);
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
