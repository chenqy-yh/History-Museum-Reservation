<template>
  <view
    class="main-content"
    :style="{
      opacity: opacity,
    }"
    @click="select"
  >
    <slot></slot>
    <div v-if="clickable && showStatus" class="radio">
      <view> {{ status_desc_list[status_idx] }} </view>
    </div>
  </view>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  status_idx: {
    type: Number,
    default: 0,
  },
  opacity: {
    type: Number,
    default: 1,
  },
  status_desc_list: {
    type: Array,
    default: () => [],
  },
  cb: {
    type: Function,
    default: () => {},
  },
  clickable: {
    type: Boolean,
    default: true,
  },
  showStatus: {
    type: Boolean,
    default: true,
  },
});

const select = () => {
  if (!props.clickable) return;
  props.cb();
};
</script>

<style lang="scss" scoped>
.main-content {
  border: 1px solid #e8d8c1;
  width: 100%;
  aspect-ratio: 4/3;
  padding: 1vw;
  box-sizing: border-box;
  border-radius: 1.5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  background-color: #f4ede3;
  .radio {
    position: absolute;
    top: 0;
    right: 0;
    width: 7vw;
    height: 2.5vh;
    font-size: 10px;
    background-color: #e8d8c1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #976b2a;
    padding-inline: 3px;
    border-bottom-left-radius: 1.5vw;
    image {
      width: 3vw;
      height: 3vw;
    }
  }
}
</style>
