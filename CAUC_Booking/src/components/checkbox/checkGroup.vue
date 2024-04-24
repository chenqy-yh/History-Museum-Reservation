<template>
  <view class="check-group">
    <view class="check-item" v-for="(item, idx) in list" :key="idx">
      <view class="check-item-content" @click="() => onCheck(idx)">
        <view class="title-ff">
          {{ item.name }}
        </view>
        <image
          :class="{
            active: item.active,
          }"
          src="/static/img/icon/check2.png"
          mode="aspectFit"
        ></image>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  checkable: {
    type: Boolean,
    default: true,
  },
  failMsg: {
    type: String,
    default: "不可选",
  },
  cb: {
    type: Function,
    default: () => {},
  },
});

const onCheck = (i) => {
  props.cb(i);
  if (!props.checkable) {
    uni.showToast({
      title: props.failMsg,
      icon: "none",
    });
    return;
  }
  props.list.forEach((item, idx) => {
    if (idx === i) {
      item.active = true;
    } else {
      item.active = false;
    }
  });
};
</script>

<style lang="scss" scoped>
.check-group {
  width: 200px;
  display: flex;
  .check-item {
    width: 100%;
    display: flex;
    align-items: center;
    .check-item-content {
      display: flex;
      width: max-content;
      .title-ff {
        font-weight: 600;
        color: #5a4822;
        margin-right: 2vw;
      }
      image {
        height: 20px;
        width: 20px;
        opacity: 0;
        transition: all 0.5s;
        &.active {
          opacity: 1;
          transition: all 0.5s;
        }
      }
    }
  }
}
</style>
