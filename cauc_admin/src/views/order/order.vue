<template>
  <div class="_outer">
    <div class="order-area" v-loading="loading_order">
      <div class="order-header">
        <div class="right-group">
          <IconButton
            icon="ri-file-excel-2-line"
            theme="simple"
            @click="openExcelDrawer"
          ></IconButton>

          <IconButton
            icon="ri-loop-left-line"
            theme="simple"
            @click="reflushOrderList"
          ></IconButton>
          <IconButton
            text="过滤条件"
            theme="light"
            @click="openOrderSettingDrawer"
          ></IconButton>
        </div>
      </div>

      <OrderTable :table-data="tableData"></OrderTable>
      <div class="footer">
        <button
          class="icon"
          :class="{
            active: current_page > 1,
          }"
          @click="goFirstPage"
        >
          <i class="ri-skip-left-fill ri-lg"></i>
        </button>
        <button
          @click="backPage"
          class="icon"
          :class="{
            active: current_page > 1,
          }"
        >
          <i class="ri-arrow-left-s-fill ri-lg"></i>
        </button>
        <input
          maxlength="5"
          type="text"
          class="page-input"
          v-model="current_page"
          @blur="orderStore.check_goto_page"
        />
        <div class="tip">/{{ total_page }}页</div>
        <button
          @click="nextPage"
          class="icon"
          :class="{
            active: current_page < total_page,
          }"
        >
          <i class="ri-arrow-right-s-fill ri-lg"></i>
        </button>
        <button
          class="icon"
          :class="{
            active: current_page < total_page,
          }"
          @click="goLastPage"
        >
          <i class="ri-skip-right-fill ri-lg"></i>
        </button>
      </div>
    </div>
    <el-drawer
      v-model="show_order_setting_drawer"
      title="设置过滤条件"
      :direction="'rtl'"
      size="400px"
    >
      <div class="order-setting-drawer">
        <el-collapse v-model="active_order_setting_tab">
          <TransitionGroup name="fade">
            <el-collapse-item title="操作状态" name="1" key="1">
              <MulCheckBox
                :items="operate_status_options"
                :change="onOperateOptionsListChange"
              ></MulCheckBox>
            </el-collapse-item>

            <el-collapse-item title="订单状态" name="2" key="2">
              <MulCheckBox
                :items="order_status_options"
                :change="onOrderStatusListChange"
              ></MulCheckBox>
            </el-collapse-item>

            <el-collapse-item title="订单异常状态" name="3" key="3">
              <MulCheckBox
                :items="order_error_status_options"
                :change="onOrderErrorStatusListChange"
              ></MulCheckBox>
            </el-collapse-item>

            <el-collapse-item title="解说员分配" name="3" key="3">
              <MulCheckBox
                :items="guide_assign_options"
                :change="onGuideAssignChange"
              ></MulCheckBox>
            </el-collapse-item>

            <el-collapse-item title="选择查询时间" name="4" key="4">
              <CustomDatePicker></CustomDatePicker>
            </el-collapse-item>
            <!-- <el-collapse-item title="游客ID" name="5" key="5">
              <el-input
                v-model="table_data_filter.value.tourist_id"
                placeholder="游客ID"
              ></el-input>
            </el-collapse-item> -->
          </TransitionGroup>
        </el-collapse>
      </div>
    </el-drawer>
    <el-drawer
      v-model="show_excel_drawer"
      title="导出excel"
      :direction="'rtl'"
      size="600px"
    >
      <ExcelView></ExcelView>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import IconButton from "@/components/button/iconButton.vue";
import MulCheckBox from "@/components/checkbox/mulCheckBox.vue";
import CustomDatePicker from "@/components/picker/customDatePicker.vue";
import ExcelView from "./components/excel/excel.vue";
import OrderTable from "./components/orderTable.vue";

import {
  useExcelStoreForSetup,
  useHomeStoreForSetup,
  useOrderStoreForSetup,
} from "@/store";
import {
  operateStatusMap,
  orderErrorStatusMap,
  orderStatusMap,
} from "@/utils/enum/order.enum";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted, ref } from "vue";

// -------------------- S T O R E -------------------- //

const homeStore = useHomeStoreForSetup();
const orderStore = useOrderStoreForSetup();
const excelStore = useExcelStoreForSetup();
const {
  current_page,
  tableData,
  total_page,
  choose_operate_status_list,
  choose_order_error_list,
  choose_order_status_list,
  choose_guide_assign,
  show_order_setting_drawer,
  active_order_setting_tab,
} = storeToRefs(orderStore);
const { loading_order } = storeToRefs(homeStore);
const { show_excel_drawer } = storeToRefs(excelStore);

// ----------------- C O N S T A N T ----------------- //

// 0 已安排 1 未安排 2 全部
const order_assign_type = ref("2");

const table_data_filter = ref();

// type check list
const operate_status_options = ref<Item<number>[]>([]);

const order_status_options = ref<Item<number>[]>([]);

const order_error_status_options = ref<Item<number>[]>([]);

// order assign type check list
const guide_assign_options = ref([
  {
    label: "未分配",
    value: 0,
  },
  {
    label: "已分配",
    value: 1,
  },
]);

// ------------------- C I R C L E ------------------- //

onBeforeMount(() => {
  // init options
  operate_status_options.value = Object.keys(operateStatusMap).map((key) => ({
    label: operateStatusMap[key],
    value: Number(key),
  }));
  order_status_options.value = Object.keys(orderStatusMap).map((key) => ({
    label: orderStatusMap[key],
    value: Number(key),
  }));

  order_error_status_options.value = Object.keys(orderErrorStatusMap).map(
    (key) => ({
      label: orderErrorStatusMap[key],
      value: Number(key),
    })
  );
});

onMounted(() => {
  reflushOrderList();
  table_data_filter.value = tableData.value;
});

// ----------------- F U N C T I O N ----------------- //

//打开右侧订单设置界面
const openOrderSettingDrawer = () => {
  show_order_setting_drawer.value = true;
};

const reflushOrderList = async () => {
  loading_order.value = true;
  await orderStore.init();
  loading_order.value = false;
};

// 订单操作状态列表改变
const onOperateOptionsListChange = async (operate_status_list: number[]) => {
  console.log("onOperateOptionsListChange:", operate_status_list);
  choose_operate_status_list.value = operate_status_list;
  loading_order.value = true;
  await orderStore.init();
  loading_order.value = false;
};

// 订单状态列表改变
const onOrderStatusListChange = async (order_status_list: number[]) => {
  console.log("onOrderStatusListChange:", order_status_list);
  choose_order_status_list.value = order_status_list;
  loading_order.value = true;
  await orderStore.init();
  loading_order.value = false;
};

// 订单异常状态改变
const onOrderErrorStatusListChange = async (
  order_error_status_list: number[]
) => {
  console.log("onOrderErrorStatusListChange:", order_error_status_list);
  choose_order_error_list.value = order_error_status_list;
  loading_order.value = true;
  await orderStore.init();
  loading_order.value = false;
};

//
const onGuideAssignChange = async (guide_assign: number[]) => {
  console.log("onGuideAssignChange:", guide_assign);

  if (guide_assign.length == 1 && guide_assign[0] == 0) {
    choose_guide_assign.value = 1;
  } else if (guide_assign.length == 1 && guide_assign[0] == 1) {
    choose_guide_assign.value = 2;
  } else {
    choose_guide_assign.value = 0;
  }
  console.log("choose_guide_assign:", choose_guide_assign.value);
  loading_order.value = true;
  await orderStore.init();
  loading_order.value = false;
};

// 下一页
const nextPage = () => {
  loading_order.value = true;
  orderStore.nextPage();
  loading_order.value = false;
};

// 上一页
const backPage = () => {
  loading_order.value = true;
  orderStore.backPage();
  loading_order.value = false;
};

// 跳转到第一页
const goFirstPage = () => {
  loading_order.value = true;
  orderStore.goFirstPage();
  loading_order.value = false;
};

// 跳转到最后一页
const goLastPage = () => {
  loading_order.value = true;
  orderStore.goLastPage();
  loading_order.value = false;
};

// 打开excel导出界面
const openExcelDrawer = () => {
  show_excel_drawer.value = true;
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

._outer {
  height: 100%;
}

.order-setting-drawer {
  width: 400px;
}

.order-area {
  height: 100%;
  background-color: var(--content-bg-color);
  padding: var(--common-padding);
  display: grid;
  grid-template-rows: max-content 1fr 7vh;
  gap: 2vh;
  .order-header {
    display: flex;
    gap: 20px;
    .right-group {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: var(--common-padding);
    }
  }
}

.footer {
  margin-inline: auto;
  width: max-content;
  border: 1px solid #ccc;
  display: flex;
  height: 30px;
  .page-input {
    // 去除点击时的蓝色边框
    outline: none;
    border: none;
    border-right: 1px solid #ccc;
    font-size: 14px;
    width: 80px;
    text-align: center;
  }
  .tip {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-inline: 10px;
    background-color: #eee;
    border-right: 1px solid #ccc;
    color: #888;
    height: 100%;
  }
  .icon {
    width: 30px;
    background-color: #eee;
    border: none;
    color: #aaa;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active {
      color: #333;
    }
    &:not(:last-child) {
      border-right: 1px solid #ccc;
    }
  }
}
</style>
