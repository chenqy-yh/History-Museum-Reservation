<template>
  <div class="month-picker-area">
    <div class="mont-picker-area-header">
      <div class="cur-year">{{ year + " " }}年</div>
      <div class="btn-group">
        <el-button @click="prevYear">上一年</el-button>
        <el-button @click="nextYear">下一年</el-button>
      </div>
    </div>
    <div class="month-block">
      <div
        class="month-item"
        :class="{
          active: choose_month_list.includes(item),
        }"
        v-for="(item, idx) in month_list"
        :key="idx"
        @click="() => addMonth(item)"
      >
        {{ cn_month_list[parseInt(item.split("-")[1]) - 1] + "月" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExcelStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

// -------------------- S T O R E -------------------- //

const excelStore = useExcelStoreForSetup();
const { active_step, choose_month_list } = storeToRefs(excelStore);

// -------------------- P R O P S -------------------- //

const year = ref(new Date().getFullYear());
const month_list = ref<string[]>([]);

// ----------------- C O N S T A N T ----------------- //

const cn_month_list = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
];

// ------------------- C I R C L E ------------------- //

watch(
  () => year.value,
  () => {
    month_list.value = [];
    //for 12
    for (let i = 1; i <= 12; i++) {
      month_list.value.push(`${year.value}-${i}`);
    }
  },
  {
    immediate: true,
  }
);

// ----------------- F U N C T I O N ----------------- //
// next year
const nextYear = () => {
  year.value = year.value + 1;
};
// prev year
const prevYear = () => {
  year.value = year.value - 1;
};

const addMonth = (month: string) => {
  if (choose_month_list.value.includes(month)) {
    choose_month_list.value = choose_month_list.value.filter(
      (it) => it !== month
    );
    return;
  }
  choose_month_list.value.push(month);
};
</script>

<style lang="scss" scoped>
.month-picker-area {
  .mont-picker-area-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: max-content;
    border-bottom: 1px solid #eee;
    padding-bottom: var(--common-padding);
    margin-bottom: var(--common-padding);
    .cur-year {
      display: flex;
      align-items: center;
      font-size: 24px;
    }
    .btn-group {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .month-block {
    --month-block-border-color: #eee;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    // gap: var(--common-padding);
    justify-items: center;
    align-items: center;
    // width: max-content;
    border-top: 1px solid var(--month-block-border-color);
    border-left: 1px solid var(--month-block-border-color);
    .month-item {
      // width: 80px;
      width: 100%;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #545454;
      border-right: 1px solid var(--month-block-border-color);
      border-bottom: 1px solid var(--month-block-border-color);
      transition: var(--common-transition);
      transform: translate3d(0, 0, 0);
      &:hover {
        background-color: #ecf5ff;
      }
      &.active {
        color: var(--common-color);
        font-size: 24px;
      }
    }
  }
}
</style>
