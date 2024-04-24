<template>
  <div class="prompt" :class="show ? notice_list[active_idx]?.type : 'info'">
    <Transition name="fade">
      <p v-if="notice_list.length > 0 && show">
        {{ notice_list[active_idx].title }}
      </p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { PropType, onMounted, ref, watch } from "vue";
import { getNoticeList } from "@/utils/api/notice";
import { useNoticeManagerStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";

// -------------------- P R O P S -------------------- //

// -------------------- S T O R E -------------------- //

const noticeManagerStore = useNoticeManagerStoreForSetup();
const { notice_list } = storeToRefs(noticeManagerStore);

// ----------------- C O N S T A N T ----------------- //
const active_idx = ref(0);

let timer: any;

const show = ref(false);

const common_delay = 5000;

// ------------------- C I R C L E ------------------- //

onMounted(async () => {
  // 初始化 notice_list
  await initNoticeList();
});

function _task() {
  if (notice_list.value.length === 0) {
    clearInterval(timer);
    return;
  }
  show.value = true;

  (async () => {
    await delay(common_delay);
    show.value = false;
    active_idx.value = (active_idx.value + 1) % notice_list.value.length;
  })();
  return _task;
}

watch(
  () => notice_list.value,
  () => {
    if (notice_list.value.length === 0) {
      return;
    }
    if (notice_list.value.length === 1) {
      active_idx.value = 0;
      show.value = true;
      return;
    }
    if (notice_list.value.length > 1) {
      clearTimeout(timer);
      timer = setInterval(_task() as any, common_delay + 1000);
    }
  },
  {
    immediate: true,
  }
);

// ----------------- F U N C T I O N ----------------- //

const initNoticeList = async () => {
  const res = await getNoticeList();
  if (res.status !== 200) {
    ElMessage.error("获取公告列表失败");
    notice_list.value = [];
  }
  notice_list.value = res.data;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.prompt {
  max-width: 500px;
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: var(--button-radius);
  transition: all 0.5s;
  overflow: hidden;
  user-select: none;
  p {
    font-size: 16px;
    color: #333;
    transition: all 0.5s;
    white-space: nowrap;
  }

  &.info {
    p {
      color: #333;
    }
  }
  &.success {
    border-color: #67c23a;
    background-color: #f0f9eb;
    p {
      color: #67c23a;
    }
  }
  &.warning {
    border-color: #e6a23c;
    background-color: #fdf6ec;
    p {
      color: #e6a23c;
    }
  }

  &.error {
    border-color: #f56c6c;
    background-color: #fef0f0;
    p {
      color: #f56c6c;
    }
  }
}
</style>
