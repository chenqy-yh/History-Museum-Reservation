<template>
  <div class="header-area">
    <div class="header-group">
      <div class="left-group">
        <i
          class="ri-list-unordered toggle-menu-btn ri-lg"
          @click="toggle_menu"
        ></i>
        <el-breadcrumb class="breadcrumb" separator="/">
          <transition-group name="breadcrumb">
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumbData"
              :key="item.path"
            >
              <!-- 不可点击项 -->
              <span
                v-if="index === breadcrumbData.length - 1"
                class="no-redirect"
                >{{ item.meta?.title }}</span
              >
              <!-- 可点击项 -->
              <a v-else class="redirect" @click="() => linkTo(item.name!)">{{
                item.meta?.title
              }}</a>
            </el-breadcrumb-item>
          </transition-group>
        </el-breadcrumb>
      </div>
      <MsgPanel :msg_queue="notice_list"></MsgPanel>
      <div class="right-group">
        <div class="self-info">
          <div class="self-avatar">
            <img :src="self_info?.avatar" alt="" />
          </div>
          <div>{{ self_info?.nickname }}</div>
        </div>
        <IconButton text="退出登陆" theme="light" :click="logout"></IconButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconButton from "../button/iconButton.vue";
import MsgPanel from "../panel/msg-panel/msg-panel.vue";

import { watch, getCurrentInstance, onMounted, ref } from "vue";
import { RouteRecordRaw } from "vue-router";
import { useRoute } from "vue-router";
import { router } from "@/router";
import { RouteRecordName } from "vue-router";
import {
  useHomeStoreForSetup,
  useUserStoreForSetup,
  useNoticeManagerStoreForSetup,
} from "../../store";
import { storeToRefs } from "pinia";

// -------------------- S T O R E -------------------- //

const userStore = useUserStoreForSetup();
const homeStore = useHomeStoreForSetup();
const noticeManagerStore = useNoticeManagerStoreForSetup();
const { self_info } = storeToRefs(userStore);
const { showMenu } = storeToRefs(homeStore);
const { notice_list } = storeToRefs(noticeManagerStore);

// ----------------- C O N S T A N T ----------------- //

const route = useRoute();
// 生成数组数据
const breadcrumbData = ref<RouteRecordRaw[]>([]);

// ------------------- C I R C L E ------------------- //
watch(
  route,
  () => {
    getBreadcrumbData();
  },
  {
    immediate: true,
  }
);

// ----------------- F U N C T I O N ----------------- //
// 根据路由获得面包屑数据
function getBreadcrumbData() {
  breadcrumbData.value = route.matched.filter(
    (item) => item.meta && item.meta.title
  );
}

// 切换菜单开闭
const toggle_menu = () => {
  showMenu.value = !showMenu.value;
};

// 跳转到指定页面
const linkTo = (name: RouteRecordName) => {
  router.push({
    name,
  });
};

// 退出登陆
const logout = () => {
  userStore.logout();
  // 重定向到 login 页面
  window.location.href = "/login";
};
</script>

<style lang="scss" scoped>
.header-area {
  background-color: var(--header-bg-color);
  height: var(--menu-brand-height);
  display: flex;
  align-items: center;
  padding: 0 var(--common-padding);
  background-color: var(--content-bg-color);
  .header-group {
    width: 100%;
    // display: flex;
    // justify-content: space-between;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    justify-items: center;
    .left-group {
      display: flex;
    }
    .right-group {
      display: flex;
      align-items: center;
      gap: var(--common-padding);
      .self-info {
        display: flex;
        align-items: center;
        gap: var(--common-padding);
        .self-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .toggle-menu-btn {
    margin-inline: var(--common-padding);
    cursor: pointer;
  }
}
</style>
