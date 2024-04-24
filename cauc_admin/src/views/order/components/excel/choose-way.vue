<template>
  <div class="main-content">
    <el-page-header @back="closeExcelDrawer">
      <template #content>
        <span class="text-large font-600 mr-3"> 选择导出方式 </span>
      </template>
    </el-page-header>
    <div class="excel-way-list">
      <div
        class="excel-way-item"
        v-for="(item, idx) in way_list"
        :key="idx"
        @click="() => nextStep(item.value)"
      >
        <i :class="item.icon"></i>
        {{ `${item.title}` }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useExcelStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { ref } from "vue";

// -------------------- S T O R E -------------------- //

const excelStore = useExcelStoreForSetup();
const { show_excel_drawer, active_step, choose_way } = storeToRefs(excelStore);

// ----------------- C O N S T A N T ----------------- //

const way_list = ref([
  {
    title: "按日获取",
    value: 1,
    icon: "ri-number-1",
  },
  {
    title: "按月获取",
    value: 2,
    icon: "ri-number-2",
  },
  {
    title: "按年获取",
    value: 3,
    icon: "ri-number-3",
  },
]);

// ----------------- F U N C T I O N ----------------- //
const nextStep = (way: number) => {
  active_step.value = 2;
  choose_way.value = way;
};

const closeExcelDrawer = () => {
  show_excel_drawer.value = false;
};
</script>

<style lang="scss" scoped>
.main-content {
  display: grid;
  grid-template-rows: max-content 1fr;
  gap: 30px;
}

.excel-way-list {
  .excel-way-item {
    cursor: pointer;
    padding-block: 10px;
    font-size: 20px;
    letter-spacing: 5px;
    transition: var(--common-transition);
    border-bottom: 1px solid #eee;
    &:first-child {
      border-top: 1px solid #eee;
    }
    &:hover {
      background-color: #f4f4f4;
      color: var(--common-color);
    }
  }
}
</style>
