<template>
  <view class="com__box" v-if="show">
    <!-- loading -->
    <view class="loading">
      <view></view>
      <view></view>
      <view></view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.com__box{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background:#00000031;
}

.loading{
  transform: scale(1.5);
}

.loading,
.loading > view {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  font-size: 0;
  color: #a89579;
}

.loading.la-dark {
  color: #333;
}

.loading > view {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}

.loading {
  width: 32px;
  height: 32px;
}

.loading > view {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  opacity: 0;
  animation: ball-scale-multiple 1s 0s linear infinite;
}

.loading > view:nth-child(2) {
  animation-delay: 0.2s;
}

.loading > view:nth-child(3) {
  animation-delay: 0.4s;
}

.loading.la-sm {
  width: 16px;
  height: 16px;
}

.loading.la-sm > view {
  width: 16px;
  height: 16px;
}

.loading.la-2x {
  width: 64px;
  height: 64px;
}

.loading.la-2x > view {
  width: 64px;
  height: 64px;
}

.loading.la-3x {
  width: 96px;
  height: 96px;
}

.loading.la-3x > view {
  width: 96px;
  height: 96px;
}

@keyframes ball-scale-multiple {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  5% {
    opacity: 0.75;
  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}
</style>
