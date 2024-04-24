<template>
  <view class="main-content">
    <slot></slot>
  </view>
</template>

<script setup></script>

<style lang="scss" scoped>
.main-content {
  --common-bg-color: #f7f3e8;
  height: 60vh;
  width: 100vw;
  background-color: var(--common-bg-color);
  position: relative;
//   border: 1px solid red;
  box-sizing: border-box;
  &::before {
    content: "";
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    width: 100vw;
    height: 30px;
    transform: translateY(-30px);
    z-index: 99999;
    background-color: var(--common-bg-color);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
}
</style>
