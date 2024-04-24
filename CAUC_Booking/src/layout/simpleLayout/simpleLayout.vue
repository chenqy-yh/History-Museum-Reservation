<template>
  <BaseLayout>
    <view
      class="main-content"
      :style="{
        overflow: fixed ? 'hidden' : 'auto',
        height: fixed ? '100vh' : 'auto',
      }"
    >
      <staticHeader
        :title="title"
        :background-color="backgroundColor"
      ></staticHeader>
      <view class="content">
        <slot></slot>
      </view>
    </view>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from "../baseLayout/baseLayout.vue";
import staticHeader from "../../components/header/staticHeader.vue";
const props = defineProps({
  title: {
    type: String,
    default: "Title",
  },
  backgroundColor: {
    type: String,
    default: "#f8f3e8",
  },
  fixed: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.main-content {
  --common-bg-color: #f8f3e8;
  background-color: var(--common-bg-color);
  box-sizing: border-box;
  min-height: 100vh;
  padding-top: 13vh;
  padding-inline: 2vw;
  padding-bottom: 2vw;
  .content {
    background-color: #fffcf7;
    height: 100%;
    border-radius: 2vw;
    padding: 2vw;
    padding-bottom: 4vw;
    // border: 1px solid red;
  }
}
</style>
