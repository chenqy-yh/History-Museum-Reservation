<template>
  <div class="edit-row" :style="edit_row_style">
    <div class="prefix">
      <div class="desc">{{ desc }}</div>
    </div>
    <IconButton
      text="选择引导员"
      :click="() => (show_pick_guide_dialog = true)"
    ></IconButton>
  </div>
</template>

<script setup lang="ts">
import IconButton from "@/components/button/iconButton.vue";

import { useOrderStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const props = defineProps({
  text: {
    type: [Number, String, Boolean],
    default: "",
  },
  desc: {
    type: String,
  },
  descWidth: {
    type: String,
    default: "120px",
  },
});

const { show_pick_guide_dialog } = storeToRefs(useOrderStoreForSetup());

const edit_row_style = computed(() => {
  return {
    "grid-template-columns": props.descWidth + " 1fr",
  };
});

const click = () => {};
</script>

<style lang="scss" scoped>
.edit-row {
  box-sizing: content-box;
  display: grid;

  width: max-content;
  height: max-content;
  align-items: center;
  font-family: "Poppins", sans-serif;
  height: 30px;
  width: 400px;
  padding-block: 10px;
  padding-inline: 10px;
  .prefix {
    display: flex;
    gap: 3px;
    align-items: center;
    width: 80%;
    border: 1px solid rgb(109, 109, 109);
    height: max-content;
    padding-block: 5px;

    .desc {
      font-size: 12px;
      width: 100%;
      height: max-content;
      text-align: center;
    }
  }

  .content {
    outline: none;
    border: 1px solid #ccc;
    background-color: #f4f4f4;
    padding-inline: 10px;
    font-size: 14px;
    height: 100%;
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    // 让滚动条变细
    scrollbar-width: thin;
    display: flex;
    align-items: center;
  }
}
</style>
