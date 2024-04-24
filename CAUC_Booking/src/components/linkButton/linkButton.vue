<template>
  <view class="link-button" @click="cb">
    <view
      class="content"
      :style="{
        ...contentStyle,
      }"
    >
      {{ text }}
    </view>
    <image
      src="/static/img/icon/right.png"
      mode="aspectFit|aspectFill|widthFix"
    >
    </image>
  </view>
</template>

<script setup>
const props = defineProps({
  contentStyle: {
    type: Object,
    default: () => {},
  },
  width: {
    type: String,
    default: "100%",
  },
  text: {
    type: String,
    default: "",
  },
  cb: {
    type: Function,
    default: () => {},
  },
});


</script>

<style lang="scss" scoped>
.link-button {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #5a4822;
  display: grid;
  grid-template-columns: 1fr 20px;
  image {
    right: 0;
    width: 20px;
    height: 20px;
  }
}
</style>
