<template>
  <view
    :animation="animation_data"
    class="mask"
    @click="click_mask"
    v-if="mask_show"
  >
  </view>

  <view
    class="main-content"
    :style="{
      transform: modelValue ? 'translateY(0)' : 'translateY(100%)',
      ...custom_style,
    }"
  >
    <slot></slot>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  custom_style: {
    type: Object,
  },
  maskClose: {
    type: Boolean,
    default: true,
  },
});

const animation_data = ref({});
const mask_show = ref(false);

watch(
  () => props.modelValue,
  (newVal) => {
    mask_show.value = newVal;
  },
  {
    immediate: true,
  }
);

const emit = defineEmits(["update:modelValue"]);

const click_mask = () => {
  if (!props.maskClose) {
    return;
  }
  emit("update:modelValue", false);
};
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 9998;
}
.main-content {
  z-index: 9999;
  position: fixed;
  box-sizing: border-box;
  transform: translateY(100%);
  bottom: 0;
  left: 0;
  width: 100vw;
  height: max-content;
  transition: all 0.4s ease;
}
</style>
