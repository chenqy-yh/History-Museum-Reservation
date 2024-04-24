<template>
  <div class="edit-order-container">
    <el-form
      ref="ruleFormRef"
      :model="edit_order_data"
      label-width="120px"
      @submit.native.prevent
    >
      <!-- id -->
      <el-form-item label="订单编号">
        <el-input :value="edit_order_data.id" :readonly="true"></el-input>
      </el-form-item>
      <!-- organize -->
      <el-form-item label="组织名称">
        <el-input :value="edit_order_data.organize" :readonly="true"></el-input>
      </el-form-item>
      <!-- pm name -->
      <el-form-item label="申请人姓名">
        <el-input :value="edit_order_data.pm_name" :readonly="true"></el-input>
      </el-form-item>
      <!-- pm tel -->
      <el-form-item label="申请人电话">
        <el-input :value="edit_order_data.pm_tel" :readonly="true"></el-input>
      </el-form-item>
      <!-- size -->
      <el-form-item label="预订参观人数">
        <el-input
          :value="getTotalSize(edit_order_data)"
          :readonly="true"
        ></el-input>
      </el-form-item>
      <!-- order time -->
      <el-form-item label="预订参观时间">
        <el-input
          :value="getOrderTimeFrame(edit_order_data)"
          :readonly="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="授权书详情">
        <IconButton
          text="查看授权书"
          theme="light"
          @click="() => getPermissionBook(edit_order_data.verify_url! , edit_order_data.sub_pm_type!)"
        ></IconButton>
      </el-form-item>
      <!-- pm type -->
      <el-form-item label="授权书格式">
        <el-input
          :value="edit_order_data.sub_pm_type"
          :readonly="true"
        ></el-input>
      </el-form-item>
      <!-- assign guide -->
      <el-form-item
        v-for="(item, idx) in edit_order_data.orderItems"
        :label="`场次-${idx + 1}-解说员`"
        :status="item.guide?.id ? 'success' : 'error'"
      >
        <el-tag v-if="item.guide?.id" type="info">{{
          item.guide?.name
        }}</el-tag>
        <el-tag v-else="" type="danger">暂未分配</el-tag>

        <!-- <el-input
          :value="item.guide?.name || '暂未分配'"
          :readonly="true"
          :input-style="{
            color: item.guide?.id ? 'green' : 'red',
          }"
        ></el-input> -->
      </el-form-item>
      <!-- order opratetor -->
      <el-form-item label="操作状态" class="form-item">
        <CRadio
          :options="operate_status_list"
          v-model="edit_order_data.operate_status"
          :pre-click="(idx) => updateOrderOperateStatus(idx)"
        ></CRadio>
      </el-form-item>

      <!-- order opratetor -->
      <el-form-item label="操作状态" class="form-item">
        <CRadio
          :options="order_status_list"
          v-model="edit_order_data.order_status"
          :pre-click="(idx) => updateOrderStatus(idx)"
        ></CRadio>
      </el-form-item>
      <!-- error status -->
      <el-form-item label="异常状态" class="form-item">
        <CRadio
          :options="order_error_status_list"
          v-model="edit_order_data.error_status"
          :pre-click="(idx) => updateOrderErrorStatus(idx)"
        ></CRadio>
      </el-form-item>
    </el-form>
    <el-descriptions title="编辑">
      <el-descriptions-item>
        <IconButton
          icon="ri-user-line"
          text="设置解说员"
          theme="light"
          :able="edit_order_data.operate_status === OperateStatusType.SOLVE"
          :msg="`请先将订单设置为 [${
            operateStatusMap[OperateStatusType.SOLVE]
          }] 状态`"
          :click="openPickGuideDialog"
        ></IconButton>
      </el-descriptions-item>
    </el-descriptions>
    <Dialog
      v-model="show_pm_dialog"
      width="80vw"
      height="80vh"
      theme="light"
      title="授权书"
      :title-style="{
        'font-size': '20px',
        'font-weight': 'bold',
        'text-align': 'center',
        'letter-spacing': '5px',
      }"
      :show-top="pm_type == PermissionTypeEnum.IMG"
      :show-cancel="false"
      confirm-name="确认"
    >
      <div class="box">
        <el-image
          style="height: 100%; aspect-ratio: 1 / 1.414"
          :src="pm_url"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="[pm_url]"
          fit="cover"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import Dialog from "@/components/dialog/dialog.vue";
import IconButton from "@/components/button/iconButton.vue";
import CRadio from "@/components/radio/c-radio.vue";

import { useOrderStoreForSetup } from "@/store";
import {
  updateOrderErrorStatus as _updateOrderErrorStatus,
  updateOrderOperateStatus as _updateOrderOperateStatus,
  updateOrderStatus as _updateOrderStatus,
} from "@/utils/api/order/order";
import {
  ALL_OPERATE_STATUS,
  ALL_ORDER_ERROR_STATUS,
  ALL_ORDER_STATUS,
  OperateStatusType,
  OrderErrorStatusType,
  OrderStatusType,
  operateStatusMap,
  orderErrorStatusMap,
  orderStatusMap,
} from "@/utils/enum/order.enum";
import { getOrderTimeFrame, getTotalSize } from "@/utils/fn";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { PermissionTypeEnum } from "@/utils/enum/type.enum";

// -------------------- S T O R E -------------------- //

const orderStore = useOrderStoreForSetup();
const {
  edit_order_data,
  show_pick_guide_dialog,
  pm_type,
  pm_url,
  show_pm_dialog,
} = storeToRefs(orderStore);

// ----------------- C O N S T A N T ----------------- //

const operate_status_list = ref<
  {
    label: string;
    value: OperateStatusType;
  }[]
>([]);

const order_status_list = ref<
  {
    label: string;
    value: OrderStatusType;
  }[]
>([]);

const order_error_status_list = ref<
  {
    label: string;
    value: OrderErrorStatusType;
  }[]
>([]);

// ------------------- C I R C L E ------------------- //

watch(
  () => edit_order_data.value.operate_status,
  () => {
    console.log("oprate_status change :", edit_order_data.value.operate_status);
  }
);

onMounted(() => {
  console.log("edit_order_data:", edit_order_data.value);

  // build operate status list
  Object.keys(operateStatusMap).forEach((key) => {
    operate_status_list.value.push({
      label: operateStatusMap[key],
      value: ALL_OPERATE_STATUS[key],
    });
  });

  // build order status list
  Object.keys(orderStatusMap).forEach((key) => {
    order_status_list.value.push({
      label: orderStatusMap[key],
      value: ALL_ORDER_STATUS[key],
    });
  });

  // build error status list
  Object.keys(orderErrorStatusMap).forEach((key) => {
    order_error_status_list.value.push({
      label: orderErrorStatusMap[key],
      value: ALL_ORDER_ERROR_STATUS[key],
    });
  });
});

// ----------------- F U N C T I O N ----------------- //

const getPermissionBook = (url: string, type: string) => {
  pm_url.value = url;
  pm_type.value = type;
  show_pm_dialog.value = true;
};

// open choose guide
const openPickGuideDialog = () => {
  show_pick_guide_dialog.value = true;
};

// 更新订单 操作 状态
const updateOrderOperateStatus = async (idx: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const res = await _updateOrderOperateStatus(
        edit_order_data.value.id,
        operate_status_list.value[idx].value
      );
      edit_order_data.value.operate_status =
        operate_status_list.value[idx].value;
      ElMessage.success("更新成功");
      resolve();
    } catch (error: any) {
      ElMessage.error(error.response.data.message || "更新失败");
      reject();
    }
  });
};

// 更新订单 状态
const updateOrderStatus = async (idx: number) => {
  console.log("updateOrderStatus:", idx);
  return new Promise<void>(async (resolve, reject) => {
    if (edit_order_data.value.order_status !== OrderStatusType.UNFINISH) {
      ElMessage.error("处于 [ 完成 ] 的订单不可再次修改状态");
      reject();
      return;
    }
    try {
      const res = await _updateOrderStatus(
        edit_order_data.value.id,
        operate_status_list.value[idx].value
      );
      edit_order_data.value.order_status = operate_status_list.value[idx].value;
      ElMessage.success("更新成功");
      resolve();
    } catch (error: any) {
      ElMessage.error(error.response.data.message || "更新失败");
      reject();
    }
  });
};

// 更新订单 异常 状态
const updateOrderErrorStatus = async (idx: number) => {
  return new Promise<void>(async (resolve, reject) => {
    if (edit_order_data.value.error_status !== OrderErrorStatusType.NONE) {
      ElMessage.error("已设置异常状态，无法再次修改");
      reject();
      return;
    }
    try {
      const res = await _updateOrderErrorStatus(
        edit_order_data.value.id,
        order_error_status_list.value[idx].value
      );
      edit_order_data.value.error_status =
        order_error_status_list.value[idx].value;
      ElMessage.success("更新成功");
      resolve();
    } catch (error: any) {
      ElMessage.error(error.response.data.message || "更新失败");
      reject();
    }
  });
};
</script>

<style lang="scss" scoped>
.box {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}

.form-item {
  display: flex;
  align-items: center;
}

.edit-order-container {
  // border: 1px solid red;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: calc(var(--common-padding) * 2);
  padding-bottom: 100px;
  padding-right: 20px;
  .ops-group {
    padding: var(--common-padding);
    display: flex;
    width: max-content;
    gap: calc(var(--common-padding) * 2);
    .op {
      opacity: 0.5;
    }
  }
}
</style>
