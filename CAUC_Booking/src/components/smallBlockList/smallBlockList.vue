<template>
  <view class="small-block-list">
    <view
      v-for="(item, idx) in small_block_list"
      :key="idx"
      class="small-block"
      @click="linkTo(item.linkTo, item.isTabbar)"
    >
      <image :src="item.url"></image>
      <view class="small-block-name">{{ item.name }}</view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  small_block_list: {
    type: Array,
    default: () => [],
  },
});

const linkTo = (url, isTabbar) => {
  if (isTabbar) {
    uni.switchTab({
      url,
    });
    return;
  } else {
    uni.navigateTo({
      url,
    });
  }
};
</script>

<style lang="scss" scoped>
.small-block-list {
  display: flex;
  margin-bottom: var(--block-margin);
  .small-block {
    display: flex;
    height: max-content;
    flex-direction: column;
    align-items: center;

    margin-right: 20px;
    padding: 5px;
    border-radius: 5px;

    image {
      width: 50px;
      height: 50px;
      object-fit: cover;
    }
    .small-block-name {
      margin-top: 5px;
      font-size: 12px;
      text-align: center;
      font-weight: 600;
      color: #4f4f4f;
    }
  }
}
</style>
