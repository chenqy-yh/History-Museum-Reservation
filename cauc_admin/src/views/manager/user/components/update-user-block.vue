<template>
  <div class="update-user-block">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="onSelect"
    >
      <el-menu-item index="1">密码修改</el-menu-item>
      <el-menu-item index="2">资料修改</el-menu-item>
      <el-menu-item index="3">删除用户</el-menu-item>
    </el-menu>
    <component :is="drawer_component" :userInfo="userInfo"></component>
  </div>
</template>

<script setup lang="ts">
import Changepwd from "./change-pwd.vue";
import ChangeProfile from "./change-profile.vue";
import DelUser from "./del-user.vue";

import { useUserStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { PropType, onMounted, ref, shallowRef } from "vue";

// -------------------- P R O P S -------------------- //
const props = defineProps({
  userInfo: {
    type: Object as PropType<IUser>,
    required: true,
  },
});

// -------------------- S T O R E -------------------- //

const userStore = useUserStoreForSetup();
const { show_drawer } = storeToRefs(userStore);

// ----------------- C O N S T A N T ----------------- //
const activeIndex = ref("1");
const drawer_component = shallowRef<any>(Changepwd);

// ------------------- C I R C L E ------------------- //

onMounted(() => {
  console.log("update-user-block:", props.userInfo);
});

// ----------------- F U N C T I O N ----------------- //
const onSelect = (index: string) => {
  activeIndex.value = index;
  switch (index) {
    case "1":
      drawer_component.value = Changepwd;
      break;
    case "2":
      drawer_component.value = ChangeProfile;
      break;
    case "3":
      drawer_component.value = DelUser;
      break;
  }
};
</script>

<style lang="scss" scoped></style>
