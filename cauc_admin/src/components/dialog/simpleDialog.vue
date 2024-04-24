s
<template>
  <TransitionGroup name="fade" tag="div">
    <div
      class="mask"
      v-if="modelValue"
      key="1"
      @click="close"
      :style="mask_style"
    ></div>
    <div
      class="main-content"
      v-if="modelValue"
      key="2"
      :style="main_content_style"
    >
      <slot></slot>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ThemeEnum } from "../../utils/enum/theme.enum";
const props = defineProps({
  title: {
    type: String,
    default: "Tips",
  },
  titleStyle: {
    type: Object,
    default: {},
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "400px",
  },
  height: {
    type: String,
    default: "300px",
  },
  maskColor: {
    type: String,
    default: "rgba(20, 20, 20, 0.5)",
  },
  theme: {
    type: String,
    default: ThemeEnum.Dark,
  },
  cancelName: {
    type: String,
    default: "Cancel",
  },
  confirmName: {
    type: String,
    default: "Confirm",
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  backgroundColor: {
    type: String,
    default: "#141414",
  },
});

const emit = defineEmits(["update:modelValue"]);

const mask_style = computed(() => {
  return {
    backgroundColor: props.maskColor,
  };
});

const main_content_style = computed(() => {
  return {
    width: props.width,
    height: props.height,
  };
});

// fn
const close = () => {
  emit("update:modelValue", false);
};
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
}

.main-content {
  z-index: 9999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: var(--common-padding);
  border-radius: 4px;
  background-color: #fefefe;
  border: 1.5px solid #bababa;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

  .container {
    border: 1px solid red;
    height: 100%;
    overflow-y: scroll;
  }
}
</style>
