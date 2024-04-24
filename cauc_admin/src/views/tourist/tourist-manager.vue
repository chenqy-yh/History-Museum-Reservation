<template>
  <div class="main-content">
    <TouristTable></TouristTable>
  </div>
</template>

<script setup lang="ts">
import TouristTable from "./components/tourist-table.vue";

import { useTouristStoreForSetup } from "@/store";
import { getTouristList } from "@/utils/api/tourist";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

// -------------------- S T O R E -------------------- //

const touristStore = useTouristStoreForSetup();
const { show_drawer } = storeToRefs(touristStore);

// ------------------- C I R C L E ------------------- //

// ----------------- F U N C T I O N ----------------- //
</script>

<style lang="scss" scoped>
.main-content {
  width: 100%;
  height: 100%;
  background-color: var(--content-bg-color);
  padding: var(--common-padding);
  display: grid;
  grid-template-rows: max-content 1fr 7vh;
}
</style>
