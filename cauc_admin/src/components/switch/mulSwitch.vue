<template>
  <div class="switch-area">
    <el-popover
      placement="bottom"
      effect="dark"
      trigger="hover"
      :popper-style="{
        'text-align': 'center',
        'max-width': '50px',
      }"
      :content="item.label"
      v-for="(item, i) in options"
      :key="i"
    >
      <template #reference>
        <div
          class="switch-item"
          :class="{
            checked: i === modelValue,
            [item.type]: true,
          }"
          @click="() => toggle_checked(i)"
        >
          {{ item.label.slice(0, 1) }}
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { PropType } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  options: {
    type: Array as PropType<ISwitchItem<number>[]>,
    default: () => [],
  },
  preUpdate: {
    type: Function as PropType<(idx: number) => Promise<boolean>>,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const toggle_checked = async (idx: number) => {
  if (props.disabled) {
    ElMessage.info("当前状态不可修改");
    return;
  }
  let isSuccess = false;

  if (props.preUpdate) {
    isSuccess = await props.preUpdate(idx);
  } else {
    isSuccess = true;
  }

  if (isSuccess) {
    emit("update:modelValue", idx);
  }
};
</script>

<style lang="scss" scoped>
.custom-popper {
  text-align: center;
}

.switch-area {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 50px;
  &::before {
    z-index: -1;
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 3px;
    background-color: #dcdcdc;
  }
  .switch-item {
    width: 30px;
    height: 30px;
    font-size: 13px;
    border-radius: 50%;
    background-color: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: var(--common-transition);
    &.checked {
      width: 45px;
      height: 45px;

      font-size: 18px;
    }
    &.success {
      background-color: #afdfff;
      color: #fefefe;
      &.checked {
        background-color: #3db2ff;
        opacity: 1;
      }
    }
    &.error {
      background-color: #ffa2a4;
      color: #fefefe;

      &.checked {
        background-color: #ff6f72;
        opacity: 1;
      }
    }
    &.warning {
      background-color: #ffc986;
      color: #fefefe;
      &.checked {
        background-color: #ffa940;
      }
    }
    &.info {
      background-color: #f7f7f7;
      border: 1px solid #c4c4c4;
      color: #9c9c9c;
      &.checked {
        background-color: #f7f7f7;
        opacity: 1;
        color: #535353;
      }
    }
  }
}
</style>
