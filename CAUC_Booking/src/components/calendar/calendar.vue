<template>
  <view class="day-list">
    <view v-for="(item, i1) in day_list" :key="i1">
      {{ item }}
    </view>
  </view>
  <view class="mouth-list" v-for="(item, i1) in month_list" :key="i1">
    <view class="mouth-list-title"> {{ item.year }}年{{ item.month }}月 </view>

    <view class="day-detail">
      <view
        v-for="(it, i2) in date_list[item.month - 1]"
        class="day-detail-item"
        :class="{
          active: it.active && !it.close,
        }"
        :key="i2"
        @click="
          props.onChooseDate({
            status_idx: it.active ? 0 : it.close ? 2 : 1,
            date: it.active ? it.date : '',
            close: it.close,
          })
        "
      >
        <view class="greg">
          {{ it.newDate === -1 ? "" : it.newDate }}
        </view>
        <view>
          <view class="lunar">
            {{ it.newDate === -1 ? "" : it.oldDate }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, watch } from "vue";
import { onReady } from "@dcloudio/uni-app";
import { getLunar } from "chinese-lunar-calendar";
import {} from "../../utils/fn/date";
import { checkTimeoutForThreeDays, newYearToOldYear } from "../../utils/fn";
const props = defineProps({
  onChooseDate: {
    type: Function,
    default: () => {},
  },
  dayDetail: {
    type: Object,
    default: () => {},
  },
});

const day_list = ["日", "一", "二", "三", "四", "五", "六"];
const date_list = ref([]);
const month_list = ref([]);

onReady(() => {
  date_list.value = Array.from({ length: 12 }, () => []);
});

watch(
  () => props.dayDetail,
  (newVal) => {
    // 判断proxy对象 detail是否为空
    if (Object.keys(newVal).length === 0) return;
    newVal.forEach((item) => {
      const { m, y, detail } = item;
      month_list.value.push({
        month: m,
        year: y,
      });
      date_list.value[m - 1] = createWeekArray(y, m, detail);
    });
  },
  {
    immediate: true,
  }
);

// fn
// 判断是否超时 提前三天
// const checkTimeout = (date) =>
//   new Date(date) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

// const newYearToOldYear = (y, mouth, day) => {
//   const str = getLunar(y, mouth, day);
//   // 返回str最后两个字符
//   return str.dateStr.slice(-2);
// };

function createWeekArray(year, month, detail) {
  const weekArray = Array.from({ length: 37 }, () => ({
    date: "",
    newDate: -1,
    oldDate: "",
    active: false,
    close: false,
  }));
  const firstDay = new Date(year, month - 1, 1); // 获取输入月份的第一天日期对象
  const lastDay = new Date(year + (month >= 12 ? 1 : 0), month % 12, 0); // 获取输入月份的最后一天日期对象
  for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
    const index = day - 1 + firstDay.getDay(); // 计算日期在数组中的索引
    //date赋值为完整日期
    weekArray[index].date = `${year}-${month}-${day}`;
    weekArray[index].newDate = day; // 将日期赋值到对应的数组位置
    weekArray[index].oldDate = newYearToOldYear(year, month, day);

    // close
    if (
      detail.close_day.indexOf(day) !== -1 ||
      checkTimeoutForThreeDays(weekArray[index].date)
    ) {
      weekArray[index].close = true;
    }
    //active
    if (!weekArray[index].close && detail.free_day.indexOf(day) !== -1) {
      weekArray[index].active = true;
    }
  }

  return weekArray;
}
</script>
<style lang="scss" scoped>
.day-list {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
  font-weight: 600;
  font-size: 14px;
  box-sizing: border-box;
  padding-bottom: 2vh;
  border-bottom: 1px solid #e3dac8;
}
.mouth-list {
  .mouth-list-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    color: #3b2121;
    padding-block: 2vh;
  }
  .day-detail {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    justify-items: center;
    font-weight: 600;
    font-size: 14px;
    box-sizing: border-box;
    padding-block: 2vh;

    .day-detail-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      // justify-content: center;
      height: 8vh;
      opacity: 0.5;
      color: #3b2121;
      &.active {
        opacity: 1;
      }
    }
  }
}
</style>
