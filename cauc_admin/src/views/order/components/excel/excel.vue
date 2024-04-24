<template>
  <div class="excel-view" v-loading="excel_loading">
    <div class="node-line" style="width: 100%">
      <el-steps direction="horizontal" :active="active_step" align-center>
        <el-step />
        <el-step />
        <el-step />
      </el-steps>
    </div>
    <Transition name="fade" mode="out-in">
      <component :is="choose_component" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import ChooseDay from "./choose-day.vue";
import ChooseMonth from "./choose-month.vue";
import ChooseWay from "./choose-way.vue";
import ChooseYear from "./choose-year.vue";
import OutExcel from "./out-excel.vue";

import { useExcelStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { computed } from "vue";
// -------------------- S T O R E -------------------- //
const excelStore = useExcelStoreForSetup();
const { active_step, choose_way, excel_loading } = storeToRefs(excelStore);

// -------------------- P R O P S -------------------- //

const choose_component = computed(() => {
  switch (active_step.value) {
    case 1:
      return ChooseWay;
    case 2:
      if (choose_way.value === 1) {
        return ChooseDay;
      } else if (choose_way.value === 2) {
        return ChooseMonth;
      } else if (choose_way.value === 3) {
        return ChooseYear;
      }
      return ChooseDay;
    case 3:
      return OutExcel;
    default:
      return ChooseWay;
  }
});

// ------------------- C I R C L E ------------------- //

// ----------------- F U N C T I O N ----------------- //
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.excel-view {
  display: grid;
  grid-template-rows: max-content 1fr;
  gap: 40px;
}

.excel-view {
}
</style>
