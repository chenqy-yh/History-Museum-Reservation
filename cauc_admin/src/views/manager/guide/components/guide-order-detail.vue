<template>
  <div class="order-detail-area">
    <div class="type-list">
      <el-button
        v-for="(item, index) in type_list"
        :key="index"
        :type="tyep_list_activeidx === index ? 'primary' : ''"
        @click="() => chooseType(index)"
      >
        {{ item.label }}
      </el-button>
    </div>
    <div class="order-list">
      <el-table
        stripe
        style="width: 100%"
        class="center-table"
        :border="true"
        :data="order_item_list"
      >
        <!-- 序号 -->
        <el-table-column label="子订单序号" fixed="left" :align="'center'">
          <template v-slot="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <!-- 订单序号 -->
        <el-table-column label="订单序号" fixed="left" :align="'center'">
          <template v-slot="{ row }">
            <span>{{ row.order.id }}</span>
          </template>
        </el-table-column>
        <!-- 订单状态 -->
        <el-table-column label="订单状态" fixed="left" :align="'center'">
          <template v-slot="{ row }">
            <span>{{ orderStatusMap[row.order.status] }}</span>
          </template>
        </el-table-column>
        <!-- 预约时间 -->
        <el-table-column label="预约时间" fixed="left" :align="'center'">
          <template v-slot="{ row }">
            <!-- <span>{{ getOrderItemTimeFrame(row.order_time) }}</span> -->
            <span>{{ row.order_time }}</span>
          </template>
        </el-table-column>
        <!-- 场次预约人数 -->
        <el-table-column label="场次预约人数" fixed="left" :align="'center'">
          <template v-slot="{ row }">
            <span>{{ row.size }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGuideStoreForSetup } from "@/store";
import { getOrderItemListByGuideId } from "@/utils/api/order/order-item";
import { orderStatusMap } from "@/utils/enum/order.enum";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

// ----------------- C O N S T A N T ----------------- //

const tyep_list_activeidx = ref(0);
const type_list = ref([
  {
    label: "未完成",
    value: "1",
  },
  {
    label: "完成",
    value: "2",
  },
  {
    label: "全部",
    value: "3",
  },
]);

const order_item_list = ref<IOrderItem[]>([]);

// -------------------- S T O R E -------------------- //
const guide_store = useGuideStoreForSetup();
const { show_drawer, update_guide_info } = storeToRefs(guide_store);

// ------------------- C I R C L E ------------------- //

watch(
  () => show_drawer.value,
  async (newVal) => {
    if (newVal) {
      try {
        const res = await getOrderItemListByGuideId(
          update_guide_info.value.id,
          tyep_list_activeidx.value
        );
        order_item_list.value = res.data;
      } catch (error) {
        console.log(error);
        ElMessage.error("获取订单列表失败");
      }
    }
  },
  {
    immediate: true,
  }
);

// ----------------- F U N C T I O N ----------------- //
const chooseType = (index: number) => {
  tyep_list_activeidx.value = index;
  getOrderItemList();
};

async function getOrderItemList() {
  try {
    console.log("type:", tyep_list_activeidx.value);
    const res = await getOrderItemListByGuideId(
      update_guide_info.value.id,
      tyep_list_activeidx.value
    );
    order_item_list.value = res.data;
  } catch (error) {
    console.log(error);
    ElMessage.error("获取订单列表失败");
  }
}

// const getOrderItemList = async () => {
//   try {
//     const res = await getOrderItemListByGuideId(
//       update_guide_info.value.id,
//       tyep_list_activeidx.value
//     );
//     order_item_list.value = res.data;
//   } catch (error) {
//     console.log(error);
//     ElMessage.error("获取订单列表失败");
//   }
// };

// 删除设置的引导员

const delOrderGuideConnection = async (order: IOrder) => {
  // confirm("确认重置订单引导员？", async () => {
  //   await deleteOrderGuidConnect(order.id!);
  //   unfinish_order_list.value = (
  //     await getOrderListByGuideId(order.guide?.id!, "unfinish")
  //   ).data.unfinish_order_list;
  // });
  // await deleteOrderGuidConnect(order_id);
  // await queryGuideList();
};
</script>

<style lang="scss" scoped></style>
