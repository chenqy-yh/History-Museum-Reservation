<template>
  <div class="date-info-container">
    <el-page-header @back="back" class="header">
      <template #content>
        <span class="text-large font-600 mr-3"> 记录详情 </span>
      </template>
    </el-page-header>

    <el-form :model="record">
      <el-form-item label="日期:">
        <el-input v-model="record!.date" :readonly="true" />
      </el-form-item>
      <el-form-item label="[上午]解说员使用量:">
        <el-input v-model="record!.t_size_am" :readonly="true" />
      </el-form-item>
      <el-form-item label="[下午]解说员使用量:">
        <el-input v-model="record!.t_size_pm" :readonly="true" />
      </el-form-item>
      <el-form-item label="预约详情:">
        <div class="book-detail-list">
          <DrawerButton
            v-for="(item, idx) in order_items_list"
            :key="idx"
            :front-color="!item ? '#444' : 'var(--common-color)'"
            :back-bg-color="!item ? '#444' : '#2ecc71'"
            :front-text="time_frame_str[idx]"
            :back-text="!item ? '未预约' : '已预约'"
            @click="() => catOrderItemDetail(item)"
          ></DrawerButton>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import DrawerButton from "@/components/button/drawerButton.vue";
import OrderItemDetail from "./order-item-detail.vue";

import { useOrderCalendarStoreForSetup } from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

// -------------------- S T O R E -------------------- //

const order_calendar_store = useOrderCalendarStoreForSetup();
const {
  record,
  drawer_component,
  choose_order_item,
  choose_order,
  drawer_title,
  show_drawer,
} = storeToRefs(order_calendar_store);

// ----------------- C O N S T A N T ----------------- //

const time_frame_str = [
  //am
  "08:30 - 09:00",
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30",
  //pm
  "13:30 - 14:00",
  "14:00 - 14:30",
  "14:30 - 15:00",
  "15:00 - 15:30",
  "15:30 - 16:00",
  "16:00 - 16:30",
];

const order_items_list = ref<IOrderItem[]>(Array.from({ length: 12 }));

// ------------------- C I R C L E ------------------- //

onMounted(() => {
  drawer_title.value = `记录详情`;
  console.log("record:", record.value);
  record.value?.orders.forEach((order) => {
    order.orderItems?.forEach((order_item) => {
      order_items_list.value[order_item.order_time_idx] = order_item;
    });
  });
  console.log("order_items_list:", order_items_list.value);
});

// ----------------- F U N C T I O N ----------------- //

const catOrderItemDetail = (order_item: IOrderItem) => {
  if (order_item === undefined) {
    ElMessage.error("该时间段未预约");
    return;
  }
  choose_order_item.value = order_item;
  choose_order.value = record.value?.orders.find((order) =>
    order.orderItems?.includes(order_item)
  );
  drawer_component.value = OrderItemDetail;
};

const back = () => {
  show_drawer.value = false;
};
</script>

<style lang="scss" scoped>
.date-info-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  .header {
    margin-bottom: 20px;
  }
  .book-detail-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--common-padding);
  }
}
</style>
