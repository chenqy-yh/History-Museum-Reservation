<template>
  <div class="main-content">
    <el-page-header @back="backStep">
      <template #content>
        <span class="text-large font-600 mr-3"> 选择导出年份 </span>
      </template>
      <template #extra>
        <div class="flex items-center">
          <!-- <el-button @click="toggleShow">{{
            show_calendar ? "查看年份列表" : "查看日历"
          }}</el-button> -->
          <el-button @click="nextStep" type="primary">导出Excel</el-button>
        </div>
      </template>
    </el-page-header>
    <div class="choose-year-content">
      <TransitionGroup name="fade">
        <div class="choose-year-block" v-if="show_calendar">
          <div
            class="choose-year-item"
            :class="{
              active: choose_year_list.includes(item.toString()),
            }"
            v-for="(item, idx) in year_list"
            :key="idx"
            @click="() => addYear(item.toString())"
          >
            {{ item + "年" }}
          </div>
        </div>
        <div class="year-list" v-else>
          <div class="sub-title">日期列表</div>
          <div class="choose-year-list">
            <TransitionGroup name="fade">
              <el-tag
                v-for="item in year_list"
                :key="item"
                closable
                type="info"
                size="large"
                @close="() => delYear(item.toString())"
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
import { useExcelStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
// -------------------- S T O R E -------------------- //

const excelStore = useExcelStoreForSetup();
const { active_step, choose_year_list } = storeToRefs(excelStore);

// ----------------- C O N S T A N T ----------------- //

const show_calendar = ref(true);
const year = ref(new Date().getFullYear());
const year_list = ref<number[]>([]);

// ------------------- C I R C L E ------------------- //

onMounted(() => {
  year_list.value = [year.value - 1, year.value, year.value + 1];
});

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

const addYear = (_year: string) => {
  if (choose_year_list.value.includes(_year)) {
    choose_year_list.value = choose_year_list.value.filter(
      (it) => it !== _year
    );
    return;
  }
  choose_year_list.value.push(_year);
};

const delYear = (year: string) => {
  choose_year_list.value = choose_year_list.value.filter((it) => it !== year);
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
.choose-year-list {
  display: flex;
  gap: var(--common-padding);
  flex-wrap: wrap;
}

.main-content {
  display: grid;
  grid-template-rows: max-content 1fr;
  gap: 30px;
  .choose-year-content {
    // border: 1px solid red;
    height: 75vh;
    overflow-y: auto;
    position: relative;
    .choose-year-block {
      --year-block-border-color: #eee;
      position: absolute;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      justify-items: center;
      align-items: center;
      border-top: 1px solid var(--year-block-border-color);
      border-left: 1px solid var(--year-block-border-color);
      .choose-year-item {
        color: #545454;
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid var(--year-block-border-color);
        border-bottom: 1px solid var(--year-block-border-color);
        transform: translate3d(0, 0, 0);
        transition: var(--common-transition);
        &:hover {
          background-color: #ecf5ff;
        }
        &.active {
          color: var(--common-color);
          font-size: 24px;
        }
      }
    }

    .year-list {
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
