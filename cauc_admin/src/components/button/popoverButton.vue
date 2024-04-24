<template>
  <el-popover
    v-if="isPopover"
    :visible="visible"
    placement="top"
    :width="160"
    popper-class="custom-popper"
    :z-index="999999"
  >
    <p>{{ popContent }}</p>
    <div class="ops-group">
      <IconButton text="取消" theme="light" :click="_onCancel"></IconButton>
      <IconButton text="确定" :click="_onConfirm"></IconButton>
    </div>
    <template #reference>
      <div @click="visible = !visible">
        <slot> </slot>
      </div>
    </template>
  </el-popover>
  <div v-else>
    <slot> </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import IconButton from "./iconButton.vue";

const props = defineProps({
  isPopover: {
    type: Boolean,
    default: true,
  },
  popContent: {
    type: String,
    default: "pop content",
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  onConfirm: {
    type: Function,
  },
  onCancel: {
    type: Function,
  },
});

const _onConfirm = () => {
  if (props.onConfirm) {
    props.onConfirm();
  }
  visible.value = false;
};

const _onCancel = () => {
  if (props.onCancel) {
    props.onCancel();
  }
  visible.value = false;
};

const visible = ref(false);
</script>

<style lang="scss" scoped>
.ops-group {
  display: flex;
  justify-content: space-around;
  gap: 10px;
  margin-top: 10px;
}
</style>
