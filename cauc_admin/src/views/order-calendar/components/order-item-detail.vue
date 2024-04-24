<template>
  <div class="main-content">
    <el-page-header @back="back" class="header">
      <template #content>
        <span class="text-large font-600 mr-3"> 单场预订详情 </span>
      </template>
    </el-page-header>
    <div class="content">
      <el-form>
        <el-form-item label="预订人:">
          <el-input :value="choose_order?.pm_name" :readonly="true" />
        </el-form-item>
        <el-form-item label="预订人电话:">
          <el-input :value="choose_order?.pm_tel" :readonly="true" />
        </el-form-item>
        <el-form-item label="单场人次">
          <el-input :value="choose_order_item?.size" :readonly="true" />
        </el-form-item>
        <el-form-item label="场次时间">
          <el-input
            :value="getOrderItemTimeFrame(choose_order_item!)"
            :readonly="true"
          />
        </el-form-item>
        <el-form-item label="解说员配置">
          <el-input
            :value="choose_order_item?.guide?.name || '未分配'"
            :readonly="true"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import RecordDetail from "./record-detail.vue";

import { useOrderCalendarStoreForSetup } from "@/store";
import { getOrderItemTimeFrame } from "@/utils/fn";
import { storeToRefs } from "pinia";

// -------------------- S T O R E -------------------- //
const order_calendar_store = useOrderCalendarStoreForSetup();
const { drawer_component, choose_order_item, choose_order } =
  storeToRefs(order_calendar_store);

// ----------------- F U N C T I O N ----------------- //
const back = () => {
  drawer_component.value = RecordDetail;
};
</script>

<style lang="scss" scoped>
.main-content {
  .header {
    margin-bottom: 20px;
  }
}
</style>
