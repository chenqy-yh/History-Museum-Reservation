<template>
  <div class="history-links" ref="historyLinks">
    <CustomLink
      v-for="(item, idx) in historyList"
      :text="item.title"
      :to="item.to"
      :on-link-close="():any => onClose(idx)"
    ></CustomLink>
  </div>
</template>

<script setup lang="ts">
import { useHomeStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import CustomLink from "./customLink.vue";

const homeStore = useHomeStoreForSetup();
const { historyList } = storeToRefs(homeStore);

// 判断 historyLinks 是否需要滚动
const historyLinks = ref<HTMLElement | any>(null);

const linkCnt = ref(20);

const show_scroll = ref(false);

watch(
  () => historyList.value,
  () => {
    if (historyLinks.value.clientWidth < historyLinks.value.scrollWidth) {
      show_scroll.value = true;
    } else {
      show_scroll.value = false;
    }
  },
  {
    deep: true,
  }
);

onMounted(() => {
  if (historyLinks.value.clientWidth < historyLinks.value.scrollWidth) {
    show_scroll.value = true;
  }
});

// fn
const onClose = (idx: number) => {
  historyList.value.splice(idx, 1);
};
</script>

<style lang="scss" scoped>
.history-links {
  height: var(--menu-brand-height);
  margin: var(--common-padding);
  margin-bottom: 0;
  padding-inline: var(--common-padding);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--common-padding);
  position: relative;
  background-color: var(--bg-primary-color);
  .toLeft {
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 100%;
    background-color: var(--bg-primary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #c0c0c0;
  }
}
.btn {
  width: 100px;
  height: 30px;
}
</style>
