<template>
  <view
    class="main-content"
    v-if="show"
    :animation="toast_animation_data"
    :class="toast_type"
    :style="{
      'animation-play-state': play_state,
    }"
  >
    {{ toast_text }}
  </view>
</template>

<script setup>
import { useCommonStore } from "../../store";
import { storeToRefs } from "pinia";
import { watch, ref } from "vue";

const { show_custom_toast, toast_duration, toast_text, toast_type } =
  storeToRefs(useCommonStore());
const show = ref(false);
const toast_animation_data = ref({});
const play_state = ref("paused");

watch(
  () => show_custom_toast.value,
  (newVal) => {
    if (newVal) {
      show.value = true;
      play_state.value = "running";
      setTimeout(() => {
        play_state.value = "paused";
      }, 300);
    } else {
      play_state.value = "running";
      setTimeout(() => {
        show.value = false;
        toast_duration.value = 2000;
        toast_text.value = "";
      }, 300);
    }
  }
);
</script>

<style lang="scss" scoped>
.main-content {
  z-index: 999999;
  position: fixed;
  top: 0;
  left: 50%;
  width: 60vw;
  height: 40px;

  border-radius: 2vw;
  transform: translate(-50%, -100%);
  animation: fade-in-out 0.6s forwards;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: 10px;
  box-sizing: border-box;
  font-size: 14px;
  &.success {
    background-color: #d2ffbc;
    color: #91e666;
  }
  &.error {
    background-color: #ffd0c6;
    color: #ff7979;
  }

  @keyframes fade-in-out {
    0% {
      opacity: 0;
      transform: translate(-50%, -100%);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, 50%);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -100%);
    }
  }
}
</style>
