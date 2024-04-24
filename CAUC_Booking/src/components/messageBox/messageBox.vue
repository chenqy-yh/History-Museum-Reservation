<template>
  <view v-if="modelValue" class="mask" @click="click_mask"> </view>

  <view
    v-if="modelValue"
    class="main-content common-shadow common-dark-bg-color common-radius"
  >
    <slot></slot>
  </view>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  maskClose: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const click_mask = () => {
  if (!props.maskClose) return;
  emit("update:modelValue", false);
};
</script>

<style lang="scss" scoped>
.mask {
  z-index: 9998;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
.main-content {
  z-index: 9999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 4vw;
  width: 60%;
}
</style>

<!-- <MessageBox 
v-model="show_permission_type"
:mask-close="false"
:on-confirm="onConfirm"
:on-cancel="onCancel"
>
<view
  class="toggle-permission-container title-ff common-font-color common-border-color"
>
  <view class="title h1 common-border-color common-sm-radius">
    温馨提示
  </view>
  <view class="content common-font-color common-border-color">
    <view class="desc"> 继续将清空之前提交的数据 </view>
  </view>
</view>
</MessageBox>

.toggle-permission-container {
  display: grid;
  .title {
    border: 1px solid;
    width: max-content;
    margin-inline: auto;
    padding-inline: 4vw;
    padding-block: 1vw;
  }
  .content {
    display: grid;

    .desc {
      // border: 1px solid red;
      margin-block: 4vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  }
} -->
