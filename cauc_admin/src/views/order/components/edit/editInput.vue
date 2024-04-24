<template>
  <div class="edit-row" :style="edit_row_style">
    <div class="prefix">
      <div class="desc">{{ desc + " :" }}</div>
    </div>
    <div class="content readonly" :class="status">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
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
  type: {
    type: String as () => "text" | "picker",
    default: "text",
  },
  status: {
    type: String,
    default: "default",
  },
});

const edit_row_style = computed(() => {
  return {
    "grid-template-columns": props.descWidth + " 1fr",
  };
});
</script>

<style lang="scss" scoped>
.edit-row {
  box-sizing: content-box;
  display: grid;
  align-items: center;
  font-family: "Poppins", sans-serif;
  height: 30px;
  width: 400px;
  .prefix {
    // display: flex;
    // gap: 3px;
    align-items: center;
    width: 90%;
    // border: 1px solid rgb(109, 109, 109);
    height: max-content;
    padding-block: 5px;

    .desc {
      font-size: 14px;
      width: 100%;
      height: max-content;
      text-align: right;
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
    &.error {
      color: red;
    }
    &.success {
      color: green;
    }
  }
}
</style>
