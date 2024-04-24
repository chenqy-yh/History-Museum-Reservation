<template>
  <div class="main-content" v-loading="loading_choose_guide">
    <!-- 选择orderItem -->
    <div class="choose-order-item">
      <div class="title">选择订单子场次</div>
      <div class="order-item-grid">
        <div
          v-for="(item, idx) in order_items_for_choose"
          class="order-item"
          :class="{
            active: item.checked,
          }"
          @click="() => onChooseOrderItem(item)"
        >
          <div class="session">场次-{{ idx + 1 }}</div>
          <div class="time-desc">{{ getOrderItemTimeFrame(item) }}</div>
        </div>
      </div>
    </div>
    <div v-if="choose_order_item">
      <div class="title">空闲管理员</div>
      <div class="guide-grid">
        <PopoverButton
          :pop-content="`确认选择该引导员？`"
          :on-confirm="
            () => onConfirmPick(choose_order_item?.id!, item.id!)
          "
          v-for="(item, idx) in guide_list"
          :key="idx"
        >
          <div
            class="guide"
            :class="{
              active: choose_guide?.id === item.id,
            }"
          >
            {{ item.name }}
          </div>
        </PopoverButton>
        <PopoverButton
          :pop-content="`确认重置解说员设置？`"
          :on-confirm="
            () => resetGuideData(choose_order_item?.id!)
          "
        >
          <div class="guide reset">重置解说员</div>
        </PopoverButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PopoverButton from "@/components/button/popoverButton.vue";

import { useOrderStoreForSetup } from "@/store";
import { getGuideList } from "@/utils/api/guide";
import { assignGuide, removeGuide } from "@/utils/api/order/";
import { getOrderItemTimeFrame } from "@/utils/fn/index";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

interface IOrderItemForChoose extends IOrderItem {
  checked: boolean;
}

// -------------------- P R O P S --------------------

const choose_guide = ref<IGuide>();

const orderStore = useOrderStoreForSetup();

const { edit_order_data } = storeToRefs(orderStore);

const guide_list = ref<IGuide[]>();

// 选择的订单子场次列表
const order_items_for_choose = ref<IOrderItemForChoose[]>([]);

// 选择的订单子场次
const choose_order_item = ref<IOrderItemForChoose>();

// loading for choose guide
const loading_choose_guide = ref(false);

// ------------------- C I R C L E -------------------

onMounted(async () => {
  console.log("choose_guide edit_order_data:", edit_order_data.value);

  guide_list.value = (await getGuideList()).data;
  order_items_for_choose.value = edit_order_data.value.orderItems!.map(
    (item) => {
      return {
        ...item,
        checked: false,
      };
    }
  );
  console.log(guide_list.value);
  // await reflushChooseGuide();
  console.log(choose_guide.value);
});

// ----------------- F U N C T I O N -----------------
// 选择订单子场次
const onChooseOrderItem = (item: IOrderItemForChoose) => {
  choose_guide.value = item.guide;
  if (item.checked) {
    choose_order_item.value = undefined;
    item.checked = false;
    return;
  }
  order_items_for_choose.value.forEach((item) => {
    item.checked = false;
  });
  item.checked = true;
  choose_order_item.value = item;
  if (item.guide) {
    choose_guide.value = item.guide;
  }
};

//为订单 配置 引导员
const onConfirmPick = (order_item_id: number, guide_id: number) => {
  loading_choose_guide.value = true;
  assignGuide(order_item_id, guide_id)
    .then(async (res) => {
      console.log(res);
      if (res.status === 201) {
        syncGuideData(order_item_id, guide_id);
      }
      // await reflushChooseGuide();
      ElMessage.success("指定成功");
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading_choose_guide.value = false;
    });
};

// 同步解说员数据
const syncGuideData = (order_item_id: number, guide_id: number | undefined) => {
  choose_guide.value = guide_list.value!.find((item) => item.id === guide_id);
  order_items_for_choose.value.find((item) => {
    if (item.id === order_item_id) {
      item.guide = choose_guide.value;
      return true;
    }
    return false;
  });
  edit_order_data.value.orderItems = order_items_for_choose.value;
};

//重置解说员
const resetGuideData = (order_item_id: number) => {
  removeGuide(order_item_id)
    .then(async (res) => {
      console.log(res);
      if (res.status === 201) {
        syncGuideData(order_item_id, undefined);
      }
      // await reflushChooseGuide();
      ElMessage.success("成功重置解说员");
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>

<style lang="scss" scoped>
.main-content {
  width: 400px;

  .title {
    font-size: 15px;
    margin-bottom: 10px;
    color: #000000;
    padding-bottom: 10px;
  }
  .order-item-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--common-padding);
    // border: 1px solid red;
    padding-bottom: var(--common-padding);
    .order-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--common-padding);
      padding-block: var(--common-padding);
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      transition: var(--common-transition);
      user-select: none;
      &:hover {
        transform: scale(1.1);
      }

      &.active {
        background-color: var(--button-primary-bg-color);
        color: #fff;
      }
      .time-desc {
        font-size: 11px;
      }
    }
  }

  .guide-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--common-padding);
    .guide {
      user-select: none;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      aspect-ratio: 1.5;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: var(--common-transition);
      color: #555;
      cursor: pointer;
      &.active {
        background-color: var(--button-primary-bg-color);
        color: #fff;
      }
      &:hover {
        transform: scale(1.1);
      }
      &.reset {
        font-size: 13px;
      }
    }
  }
}
</style>
