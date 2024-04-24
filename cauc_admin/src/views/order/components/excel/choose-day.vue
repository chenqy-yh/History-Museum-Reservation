<template>
  <div class="main-content">
    <el-page-header @back="backStep">
      <template #content>
        <span class="text-large font-600 mr-3"> 选择导出日期 </span>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button @click="toggleShow">{{
            show_calendar ? "查看日期列表" : "查看日历"
          }}</el-button>
          <el-button @click="nextStep" type="primary">导出Excel</el-button>
        </div>
      </template>
    </el-page-header>
    <div class="choose-day-content">
      <TransitionGroup name="fade">
        <el-calendar ref="calendar" v-if="show_calendar" class="calendar">
          <template #header="{ date }">
            <!-- <span>Custom header content</span> -->
            <span>{{ date }}</span>
            <el-config-provider>
              <el-button-group>
                <el-button size="small" @click="selectDate('prev-year')">
                  去年
                </el-button>
                <el-button size="small" @click="selectDate('prev-month')">
                  上一月
                </el-button>
                <el-button size="small" @click="selectDate('today')"
                  >今天</el-button
                >
                <el-button size="small" @click="selectDate('next-month')">
                  下一月
                </el-button>
                <el-button size="small" @click="selectDate('next-year')">
                  明年
                </el-button>
              </el-button-group>
            </el-config-provider>
          </template>
          <template #date-cell="{ data }">
            <p
              class="date-item"
              :class="{
                'choose-day': checkIsSelected(data),
              }"
              @click="() => addDay(data)"
            >
              {{ formatDateCeil(data) }}
            </p>
          </template>
        </el-calendar>
        <div class="day-list" v-else>
          <div class="sub-title">日期列表</div>
          <div class="choose-day-list">
            <TransitionGroup name="fade">
              <el-tag
                v-for="item in choose_day_list"
                :key="item"
                closable
                type="info"
                size="large"
                @close="() => delDay(item)"
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
import { CalendarDateType, CalendarInstance } from "element-plus";
import { storeToRefs } from "pinia";
import { ref } from "vue";

interface DateCeil {
  date: Date;
  day: string;
  isSelected: boolean;
  type: string;
}

// -------------------- S T O R E -------------------- //

const excelStore = useExcelStoreForSetup();
const { active_step, choose_day_list } = storeToRefs(excelStore);

// ----------------- C O N S T A N T ----------------- //

const show_calendar = ref(true);

const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
  // console.log(val);
  if (!calendar.value) {
    return;
  }
  calendar.value.selectDate(val);
};

// ------------------- C I R C L E ------------------- //

// ----------------- F U N C T I O N ----------------- //

const nextStep = () => {
  active_step.value = 3;
};
const backStep = () => {
  active_step.value = 1;
};

const addDay = (val: DateCeil) => {
  if (choose_day_list.value.includes(val.day)) {
    choose_day_list.value = choose_day_list.value.filter(
      (it) => it !== val.day
    );
    return;
  }
  choose_day_list.value.push(val.day);
};

const delDay = (day: string) => {
  choose_day_list.value = choose_day_list.value.filter((it) => it !== day);
};

const formatDateCeil = (val: DateCeil) => {
  return val.day.split("-")[2];
};

const checkIsSelected = (val: DateCeil) => {
  return choose_day_list.value.includes(val.day);
};

const toggleShow = () => {
  show_calendar.value = !show_calendar.value;
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

.calendar {
  position: absolute;
}
.day-list {
  position: absolute;
}

.date-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--common-transition);
  color: #545454;
  &.choose-day {
    color: var(--common-color);
    font-size: 24px;
  }
}
.choose-day-list {
  display: flex;
  gap: var(--common-padding);
  flex-wrap: wrap;
}

.main-content {
  display: grid;
  grid-template-rows: max-content 1fr;
  gap: 30px;
  .choose-day-content {
    height: 75vh;
    overflow-y: auto;
    .sub-title {
      font-size: 20px;
      margin-bottom: var(--common-padding);
      padding-bottom: var(--common-padding);
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
