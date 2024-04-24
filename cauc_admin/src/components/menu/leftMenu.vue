<template>
  <el-menu default-active="1" class="custom-menu" :collapse="only_show_icon">
    <el-menu-item class="brand" @click="only_show_icon = !only_show_icon">
      <el-icon>
        <Brand size="small"></Brand>
      </el-icon>
      <span v-show="!only_show_icon" class="menu-main-title">LeafAdmin</span>
    </el-menu-item>
    <MenuItem
      :key="idx"
      :index="item.name"
      v-for="(item, idx) in menu_list"
      :menu-item="item"
    ></MenuItem>
    <!-- <el-sub-menu :key="idx" :index="item.name" v-for="(item, idx) in menu_list">
      <template #title>
        <el-icon><i :class="item.icon"></i></el-icon>
        <span>{{ item.name }}</span>
      </template>
      <MenuItem
        v-if="item.children && item.children.length > 0"
        v-for="(son, i) in item.children"
        :key="i"
        :menu-item="son"
      ></MenuItem>
    </el-sub-menu> -->
  </el-menu>
</template>

<script setup lang="ts">
import Brand from "@/components/brand/brand.vue";
import MenuItem from "./menuItem.vue";

import { router } from "@/router";
import { onMounted, ref, watch } from "vue";
import { RouteRecordRaw, Router } from "vue-router";

const only_show_icon = ref(false);

const menu_list = ref<IMenuItem[]>([]);
const screenWidth = ref(
  window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
);

watch(
  () => screenWidth.value,
  (val) => {
    if (val < 1024) {
      only_show_icon.value = true;
    } else {
      only_show_icon.value = false;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  window.onresize = () => {
    screenWidth.value =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
  };

  const new_routes = router.getRoutes();

  new_routes.forEach((route) => {
    if (route.meta?.isTop && route.meta.show) {
      menu_list.value.push({
        icon: route.meta.icon,
        link_name: route.name,
        name: route.meta.title,
        path: route.path,
        children:
          route.children && route.children.length > 0
            ? push_kids(route.children)
            : undefined,
      } as IMenuItem);
    }
  });
});

const push_kids = (kids: RouteRecordRaw[]): IMenuItem[] => {
  return kids.map((item) => {
    return {
      icon: item.meta?.icon,
      link_name: item.name,
      name: item.meta?.title,
      path: item.path,
      children:
        item.children && item.children.length > 0 && push_kids(item.children),
    } as IMenuItem;
  }) as IMenuItem[];
};

const appendRouteChild = (
  c_route: RouteRecordRaw,
  f_route: RouteRecordRaw,
  target: string
) => {
  if (f_route.name === target) {
    f_route.children?.push(c_route);
  } else {
    f_route.children?.forEach((item) => {
      appendRouteChild(c_route, item, target);
    });
  }
};

const findRouteByName = (
  route_name: string,
  routes: RouteRecordRaw[]
): RouteRecordRaw | undefined => {
  return routes.find((route) => {
    if (route.name === route_name) {
      return route;
    }
    if (route.children && route.children.length > 0) {
      const ret = findRouteByName(route_name, route.children);
      if (ret !== undefined) {
        return ret;
      }
    }
    return undefined;
  });
};

const resetRoutes = (route: RouteRecordRaw, router: Router) => {
  router.addRoute(route);
  if (route.children && route.children.length > 0) {
    route.children.forEach((item) => {
      resetRoutes(item, router);
    });
  }
};

const toggle_menu = () => {
  only_show_icon.value = !only_show_icon.value;
};

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style lang="scss" scoped>
.custom-menu:not(.el-menu--collapse) {
  min-height: 400px;
  width: 200px;
  height: 100%;
  user-select: none;

  .brand {
    box-sizing: content-box;
    border-bottom: 1px solid #dfdfdf;
    height: var(--menu-brand-height);
    &:hover {
      background-color: #fefefe;
    }
    .menu-main-title {
      font-size: 20px;
      font-weight: 600;
    }
  }
}
</style>
