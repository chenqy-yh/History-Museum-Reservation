<template>
  <div class="main-content">
    <div class="bg-img">
      <img :src="getAssetsImage('images/icon/common/success.png')" alt="" />
    </div>
    <p>报表已经成功导出!</p>
    <el-button @click="show_excel_drawer = false">返回</el-button>
  </div>
</template>

<script setup lang="ts">
import { useExcelStoreForSetup } from "@/store";
import {
  printExcelByDay,
  printExcelByMonth,
  printExcelByYear,
} from "@/utils/api/";
import { toExcel } from "@/utils/fn/xlsx";
import { getAssetsImage } from "@/utils/static/pub-use";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

// -------------------- S T O R E -------------------- //

const excelStore = useExcelStoreForSetup();
const {
  choose_day_list,
  excel_loading,
  show_excel_drawer,
  choose_way,
  choose_month_list,
  choose_year_list,
} = storeToRefs(excelStore);

// ------------------- C I R C L E ------------------- //

onMounted(async () => {
  excel_loading.value = true;
  printExcel();
  excel_loading.value = false;
});

// ----------------- F U N C T I O N ----------------- //

// print excel
const printExcel = async () => {
  console.log(choose_way.value);
  switch (choose_way.value) {
    case 1:
      // 对 choose_day_list 进行排序 yyyy-mm-dd
      choose_day_list.value.sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      });
      const res_day = await printExcelByDay(choose_day_list.value);
      toExcel(res_day.data, "日表");
      break;
    case 2:
      // 对 choose_month_list 进行排序 yyyy-mm
      choose_month_list.value.sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      });
      const res_month = await printExcelByMonth(choose_month_list.value);
      toExcel(res_month.data, "月表");
      break;
    case 3:
      // 对 choose_year_list 进行排序 yyyy
      choose_year_list.value.sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      });
      const res_year = await printExcelByYear(choose_year_list.value);
      toExcel(res_year.data, "年表");
      break;
  }
};
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  gap: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .bg-img {
    width: 60%;
    aspect-ratio: 1;
    // border: 1px solid red;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    font-size: 20px;
    color: var(--text-primary-color);
    letter-spacing: 3px;
  }
}
</style>
