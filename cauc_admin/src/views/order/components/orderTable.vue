<template>
  <el-table
    :data="tableData"
    stripe
    style="width: 100%"
    class="center-table"
    :border="true"
    empty-text="空"
  >
    <el-table-column type="index" label="序号" fixed="left" :align="'center'">
      <template v-slot="{ row }">
        <span
          class="table-row"
          :class="{
            del: checkOrderFinish(row),
          }"
          >{{ row.id }}</span
        >
      </template>
    </el-table-column>

    <el-table-column prop="pm_name" label="预订人名称" :align="'center'">
      <template v-slot="{ row }">
        <div
          class="table-row"
          :class="{
            del: checkOrderFinish(row),
          }"
        >
          {{ row.pm_name }}
        </div>
      </template>
    </el-table-column>
    <el-table-column sortable prop="status" label="操作状态" :align="'center'">
      <template v-slot="{ row }">
        <div
          class="table-row"
          :class="{
            del: checkOrderFinish(row),
          }"
        >
          <el-tag
            :type="
              row.operate_status === OperateStatusType.UNSOLVE
                ? 'danger'
                : 'success'
            "
          >
            {{ operateStatusMap[row.operate_status] }}
          </el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="need" label="解说员需求" :align="'center'">
      <template v-slot="{ row }">
        <div
          class="table-row"
          :class="{
            del: checkOrderFinish(row),
          }"
        >
          <el-tag
            type="success"
            v-if="
              row.operate_status === OperateStatusType.SOLVE &&
              !checkOrderFinish(row) &&
              isAssignComplete(row)
            "
            >已分配</el-tag
          >
          <el-tag
            type="danger"
            v-else="
              row.operate_status === OperateStatusType.SOLVE &&
              !checkOrderFinish(row) &&
              !isAssignComplete(row)
            "
            >未分配</el-tag
          >
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="organize" label="组织名称" :align="'center'">
      <template v-slot="{ row }">
        <div
          class="table-row"
          :class="{
            del: checkOrderFinish(row),
          }"
        >
          {{ row.organize }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      prop="order_time"
      label="订单预定时间"
      :align="'center'"
      width="max-content"
    >
      <template v-slot="{ row }">
        <div
          class="table-row"
          :class="{
            del: checkOrderFinish(row),
          }"
        >
          <el-tag type="info">{{ getOrderTimeFrame(row) }}</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      prop="size"
      label="预定参观人数"
      :align="'center'"
    >
      <template v-slot="{ row }">
        <div
          class="table-row"
          :class="{
            del: checkOrderFinish(row),
          }"
        >
          {{ getTotalSize(row) }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="120" :align="'center'">
      <template v-slot="{ row }">
        <div class="ops-group">
          <el-button @click="() => open_edit_order_dialog(row)"
            >编辑订单</el-button
          >
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-drawer
    v-model="show_edit_order_dialog"
    title="编辑订单"
    :direction="'rtl'"
    size="600px"
  >
    <EditOrder></EditOrder>
  </el-drawer>
  <!-- Dialog fro pick guide -->
  <Dialog
    width="max-content"
    height="80vh"
    v-model="show_pick_guide_dialog"
    theme="light"
    title="选择引导员"
    :title-style="{
      'font-size': '20px',
      'font-weight': 'bold',
      'text-align': 'center',
      'letter-spacing': '5px',
    }"
    :show-cancel="false"
    confirm-name="确认"
    :show-confirm="true"
    :on-confirm="onConfirmChooseGuide"
  >
    <div>
      <ChooseGuide></ChooseGuide>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "@/components/dialog/dialog.vue";
import ChooseGuide from "./choose-guide.vue";
import EditOrder from "./editOrder.vue";

import { useHomeStoreForSetup, useOrderStoreForSetup } from "@/store";
import { OperateStatusType, operateStatusMap } from "@/utils/enum/order.enum";
import { getOrderTimeFrame, getTotalSize } from "@/utils/fn";
import { checkOrderFinish } from "@/utils/fn/order";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

// -------------------- P R O P S --------------------

const props = defineProps({
  tableData: {
    type: Array as () => IOrder[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// -------------------- S T O R E -------------------- //

const homeStore = useHomeStoreForSetup();
const orderStore = useOrderStoreForSetup();
const {
  show_edit_order_dialog,
  show_pick_guide_dialog,
  edit_order_data,
} = storeToRefs(orderStore);
const { loading_order } = storeToRefs(homeStore);

// ------------------- C I R C L E -------------------
onMounted(() => {
  console.log("table_data:", props.tableData);
  // props.tableData.forEach((item) => {
  //   item.
  // });
});

// ----------------- F U N C T I O N -----------------
const isAssignComplete = (order: IOrder) => {
  return order.orderItems!.every((item) => item.guide?.id);
};

const open_edit_order_dialog = (row: IOrder) => {
  edit_order_data.value = row;
  show_edit_order_dialog.value = true;
};

const onConfirmChooseGuide = () => {
  return new Promise<void>(async (resolve, reject) => {
    loading_order.value = true;
    await orderStore.init();
    loading_order.value = false;
    resolve();
  });
};
</script>

<style lang="scss" scoped>
.table-row {
  display: flex;
  justify-content: center;
  &.success {
    color: #67c23a;
  }
  &.error {
    color: #f56c6c;
  }
  &.del {
    opacity: 0.3;
  }
}

.ops-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  .op-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    &.primary {
      border: 1.5px solid var(--button-primary-bg-color);
      color: var(--button-primary-bg-color);
      transition: var(--common-transition);
      &:hover {
        background-color: var(--button-primary-bg-color);
        color: var(--button-primary-color);
        transition: var(--common-transition);
      }
    }
    &.warning {
      border: 1.5px solid var(--button-warning-bg-color);
      color: var(--button-warning-bg-color);
      transition: var(--common-transition);
      &:hover {
        background-color: var(--button-warning-bg-color);
        color: var(--button-warning-color);
        transition: var(--common-transition);
      }
    }
  }
}
</style>
