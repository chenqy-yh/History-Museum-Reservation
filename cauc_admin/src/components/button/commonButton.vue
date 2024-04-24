<template>
  <button type="button" class="common-button" @click="click">{{ text }}</button>
</template>

<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: "button",
  },
  click: Function as PropType<(event: MouseEvent) => void>,
});
</script>

<style lang="scss" scoped>
.common-button {
  width: 100%;
  height: 40px;
  border-radius: var(--common-radius);
  background-color: #409eff;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
}
</style>
