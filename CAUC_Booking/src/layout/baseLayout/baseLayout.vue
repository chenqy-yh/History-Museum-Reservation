<template>
  <view>
    <slot></slot>
  </view>
  <CToast />
  <CommonLoading :show="loading" />
</template>

<script setup>
import CToast from "../../components/toast/CustomToast";
import CommonLoading from "../../components/loading/commonLoading.vue";
import { storeToRefs } from "pinia";

import { onLoad } from "@dcloudio/uni-app";
import { useUserStore, useCommonStore } from "../../store";

const userStore = useUserStore();
const commonStore = useCommonStore();

const { loading } = storeToRefs(commonStore);

const {} = onLoad(() => {
  userStore.restore_user_info();
});
</script>

<style lang="scss" scoped></style>
