<template>
  <div
    class="button-box"
    :class="{
      active: props.active,
    }"
    @click="prefromClick"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";

const props = defineProps({
  active: {
    type: Boolean,
    default: true,
  },
});

const prefromClick = () => {
  //if active
  //preform click
  //else
  // message error
  console.log('prefromClick');
  ElMessage.success("ok");
  return;
};
</script>

<style lang="scss" scoped>
.button-box {
  //   border: 1px solid red;
  opacity: 0.5;
  &.active {
    opacity: 1;
  }
}
</style>
