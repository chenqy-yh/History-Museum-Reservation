<template>
  <div class="link-box" @click="">
    <RouterLink
      class="link"
      :to="{
        name: to,
      }"
      >{{ text }}</RouterLink
    >
    <i class="ri-close-fill ri-sm icon" @click="onLinkClose"></i>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { RouteRecordName } from "vue-router";

const props = defineProps({
  onLinkClose: Function as PropType<() => (payload: MouseEvent) => void>,
  text: {
    type: String,
    default: "link",
  },
  to: String as PropType<RouteRecordName>,
});
</script>

<style lang="scss" scoped>
.link-box {
  position: relative;
  width: max-content;
  background-color: var(--bg-primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--button-border-light-color);
  border-radius: var(--common-radius);
  transition: var(--common-transition);
  padding-inline: 5px;
  user-select: none;
  // overflow: hidden;
  &:hover {
    border-color: var(--primary-color);
    transition: var(--common-transition);
    .link,
    .icon {
      color: var(--primary-color);
      transition: var(--common-transition);
    }
  }

  .link {
    // padding: var(--common-padding);
    padding-inline: 5px;
    // border: 1px solid red;
    padding-block: 5px;
    font-size: 14px;
    text-decoration: none;
    color: black;
    transition: var(--common-transition);
  }
  .icon {
    // border: 1px solid red;
    cursor: pointer;
    transition: var(--common-transition);
  }
}
</style>
