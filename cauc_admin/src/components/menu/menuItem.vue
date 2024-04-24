<template>
  <el-sub-menu
    v-if="menuItem.children && menuItem.children.length > 0"
    :index="menuItem.name"
  >
    <template #title>
      <el-icon v-if="menuItem.icon"><i :class="menuItem.icon"></i></el-icon>
      <span>{{ menuItem.name }}</span>
    </template>
    <menuItem
      v-if="menuItem.children && menuItem.children.length > 0"
      v-for="(item, idx) in menuItem.children"
      :menu-item="item"
      :key="idx"
    ></menuItem>
  </el-sub-menu>
  <el-menu-item v-else :index="menuItem.name" @click="clickMenu">
    <el-icon v-if="menuItem.icon"><i :class="menuItem.icon"></i></el-icon>
    <span>{{ menuItem.name }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { useHomeStoreForSetup } from "@/store";
import { PropType, ref } from "vue";
import { router } from "../../router";

const props = defineProps({
  menuItem: {
    type: Object as PropType<IMenuItem>,
    required: true,
  },
});

const homeStore = useHomeStoreForSetup();

const showSubMenu = ref(false);

// fn

const clickMenu = () => {
  linkTo(props.menuItem);
};

const linkTo = (menuItem: IMenuItem) => {
  homeStore.addHistorLink({
    title: menuItem.name!,
    to: menuItem.link_name,
  });
  router.push({
    name: menuItem.link_name,
  });
};

const toggle_sub_menu = () => {
  showSubMenu.value = !showSubMenu.value;
};
</script>

<style lang="scss" scoped>
// .v-enter-active,
// .v-leave-active {
//   transition: all 0.2s ease;
// }

// .v-enter-from,
// .v-leave-to {
//   transform: scaleY(0);
// }

// .menu-kids {
//   transform-origin: top;
//   overflow: hidden;
// }

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.5s;
  // 防止折叠时元素溢出
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  height: 0px !important;
  opacity: 0;
}

.menu-kids {
  /* 如果需要其他样式，可以在这里添加 */
}

.menu-item {
  //   border: 1px solid blue;
  height: var(--menu-item-height);
  display: grid;
  grid-template-columns: var(--menu-icon-size) 1fr 30px;
  gap: 1vw;
  align-items: center;
  color: var(--menu-item-color);
  font-size: 15px;
  transition: var(--common-transition);
  white-space: nowrap;

  .icon {
    justify-self: center;
  }

  .menu-item-name {
    justify-self: start;
    // border: 1px solid red;
  }
  .arrow {
    justify-self: end;
    padding-inline: 10px;
  }
  &:hover {
    filter: brightness(1.5);
    transition: var(--common-transition);
  }
}
</style>
