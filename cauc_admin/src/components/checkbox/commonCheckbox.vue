<template>
  <label @click="callback" class="form-control">
    <input class="check" type="checkbox" name="checkbox" :checked="checked" />
    <div class="text">{{ text }}</div>
  </label>
</template>

<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: "",
  },
  callback: {
    type: Function as PropType<(event: MouseEvent) => void>,
    default: () => {},
  },
});
</script>

<style lang="scss" scoped>
.form-control {
  display: flex;
  width: max-content;
  border: 1.5px solid var(--common-color);
  position: relative;
  padding: var(--common-padding);
  user-select: none;
  cursor: pointer;
  transition: var(--common-transition);

  &:hover {
    background-color: var(--common-color);
    transition: var(--common-transition);
    .text {
      color: #fff;
    }
  }
  .text {
    z-index: 9;
    color: var(--common-color);
  }
  .check {
    z-index: 8;
    appearance: none;
    -webkit-appearance: none;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    &:checked {
      background-color: var(--common-color);
      // 选择兄弟元素 .text
      & ~ .text {
        color: #fff;
      }
    }
  }
}
</style>
