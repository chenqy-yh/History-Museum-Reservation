<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="onSelect"
    >
      <el-menu-item index="1">查询</el-menu-item>
      <el-menu-item index="2">资料修改</el-menu-item>
      <el-menu-item index="3">删除</el-menu-item>
    </el-menu>
    <div class="content">
      <component :is="drawer_component"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import DelGuide from "./del-guide.vue";
import GuideOrderDetail from "./guide-order-detail.vue";
import UpdateGuide from "./update-guide.vue";

import { onMounted, ref, shallowRef } from "vue";

// ----------------- C O N S T A N T ----------------- //

const activeIndex = ref("1");

const drawer_component = shallowRef(GuideOrderDetail);

// -------------------- S T O R E -------------------- //

// ------------------- C I R C L E ------------------- //

// ----------------- F U N C T I O N ----------------- //

const onSelect = (index: string) => {
  switch (index) {
    case "1":
      drawer_component.value = GuideOrderDetail;
      break;
    case "2":
      drawer_component.value = UpdateGuide;
      break;
    case "3":
      drawer_component.value = DelGuide;
      break;
    default:
      drawer_component.value = GuideOrderDetail;
  }
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: 30px;
}
</style>
