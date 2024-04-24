<template>
  <div
    class="common-layout-area"
    :style="common_layout_area_style"
    v-loading="ping_loading"
  >
    <el-aside class="menu-area" v-if="showMenu">
      <LeftMenu></LeftMenu>
    </el-aside>

    <div class="content" :style="content_style">
      <Header></Header>
      <Transition name="custom">
        <HistoryBox v-if="homeStore.historyList.length > 0"></HistoryBox>
      </Transition>
      <div
        class="container"
        :style="{
          height: container_height_style,
        }"
      >
        <router-view v-slot="{ Component }">
          <transition name="custom" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HistoryBox from "@/components/box/historyBox.vue";
import Header from "@/components/header/header.vue";
import LeftMenu from "@/components/menu/leftMenu.vue";
import { setupDynamicRoutes } from "@/router/modules";
import { useHomeStoreForSetup, useUserStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted, ref } from "vue";

// -------------------- S T O R E -------------------- //

const homeStore = useHomeStoreForSetup();
const userStore = useUserStoreForSetup();
const { showMenu } = storeToRefs(homeStore);

// ----------------- C O N S T A N T ----------------- //

const ping_loading = ref(false);
const server_on = ref(true);

const container_height_style = computed(() => {
  return homeStore.historyList.length > 0
    ? "calc(100vh - var(--menu-brand-height) * 2 - var(--common-padding) * 3)"
    : "calc(100vh - var(--menu-brand-height) - var(--common-padding) * 2 )";
});

// ------------------- C I R C L E ------------------- //

onBeforeMount(async () => {
  // 从缓存中获取动态路由信息
  setupDynamicRoutes();
  // 获取个人信息
  userStore.getSelfInfo();
});

onMounted(() => {
  console.log("CommonLayout onMounted");
});

// ----------------- F U N C T I O N ----------------- //

const common_layout_area_style = computed(() => {
  return {
    "grid-template-columns": showMenu.value ? "max-content 1fr" : "1fr",
  };
});

const content_style = computed(() => {
  return {
    "grid-template-rows":
      homeStore.historyList.length > 0
        ? "max-content max-content 1fr"
        : " max-content 1fr",
  };
});
</script>

<style lang="scss" scoped>
.custom-enter-active,
.custom-leave-active {
  transition: all 0.3s;
}

.custom-enter-from,
.custom-leave-to {
  opacity: 0;
}

.common-layout-area {
  display: grid;
  grid-template-columns: max-content 1fr;
  height: 100vh;
  max-height: 100vh;
  position: relative;
  .menu-area {
    width: max-content;
    transform-origin: left;
  }
  .content {
    min-width: 400px;
    background-color: var(--content-bg-bt-color);
    height: 100%;
    display: grid;

    .container {
      margin: var(--common-padding);
      overflow-y: auto;
      transition: var(--common-transition);
    }
  }
}
</style>
