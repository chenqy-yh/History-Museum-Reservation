<template>
  <div class="radio-component">
    <div v-for="(item, idx) in options">
      <el-popover
        v-if="preClick"
        :visible="popover_show_list[idx]"
        placement="top"
        :width="160"
        trigger="click"
      >
        <p>{{ message }}</p>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text @click="popover_show_list[idx] = false"
            >取消</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="() => checkedOptions(idx)"
            >确认</el-button
          >
        </div>
        <template #reference>
          <div class="op-item" @click="popover_show_list[idx] = true">
            <div class="checkbox" :class="{ active: idx === modelValue }"></div>
            <span>{{ item.label }}</span>
          </div>
        </template>
      </el-popover>
      <div v-else class="op-item" @click="() => checkedOptions(idx)">
        <div class="checkbox" :class="{ active: idx === modelValue }"></div>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";

interface RadioItem {
  label: string;
  value: any;
}

// -------------------- P R O P S -------------------- //
const props = defineProps({
  options: {
    type: Array as PropType<RadioItem[]>,
    default: () => [],
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  preClick: {
    type: Function as PropType<(idx: number) => Promise<any>>,
  },
  message: {
    type: String,
    default: "确认选择该选项吗？",
  },
});

const emit = defineEmits(["update:modelValue"]);

// ----------------- C O N S T A N T ----------------- //

const popover_show_list = ref(
  Array.from({ length: props.options.length }, () => false)
);

// ----------------- F U N C T I O N ----------------- //

const checkedOptions = (idx: number) => {
  console.log("checkedOptions:", idx);
  if (props.preClick) {
    props.preClick(idx).catch(() => {
      /* TODO */
    });
  } else {
    emit("update:modelValue", idx);
  }
  popover_show_list.value[idx] = false;
};
</script>

<style lang="scss" scoped>
.radio-component {
  display: flex;
  justify-content: space-between;
  gap: 30px;

  .op-item {
    display: flex;
    align-items: center;
    gap: 10px;
    .checkbox {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: transparent;
      border: 1px solid #ccc;
      position: relative;
      &::before {
        position: absolute;
        content: "";
        width: 0px;
        height: 0px;
        border-radius: 50%;
        background: #fefefe;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 999;
        transition: var(--common-transition);
      }
    }
    span {
      transition: var(--common-transition);
    }
    .checkbox.active {
      background: var(--common-color);
      border-color: var(--common-color);
    }
    .checkbox.active::before {
      width: 4px;
      height: 4px;
    }
    .checkbox.active ~ span {
      color: var(--common-color);
    }
  }
}
</style>
