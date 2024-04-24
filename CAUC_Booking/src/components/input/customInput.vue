<template>
  <view class="main-content">
    <input
      class="cinput"
      v-model="val"
      :type="type"
      :maxlength="maxLen"
      @input="onInput"
      @blur="onBlur"
    />
    <view class="pls title-ff" v-show="!val">
      {{ placeholder }}
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  placeholder: {
    type: String,
    default: "请输入申请人姓名",
  },
  type: {
    type: String,
    default: "text",
  },
  maxLen: {
    type: Number,
    default: 11,
  },
  onInput: {
    type: Function,
    default: () => {},
  },
  onBlur: {
    type: Function,
    default: () => {},
  },
});

const val = ref("");
</script>

<style lang="scss" scoped>
.main-content {
  position: relative;
  .pls {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-size: 14px;
    color: #b3a486;
  }
}
.cinput {
  box-sizing: border-box;
}
</style>
