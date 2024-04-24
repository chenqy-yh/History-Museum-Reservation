<template>
  <div class="radio-box">
    <div class="radio-box-item" v-for="(item, idx) in options">
      <input
        name="radio-item"
        type="radio"
        :id="`radio-box-item-${idx}`"
        @change="_onChange"
        :value="item.value"
      />
      <label :for="`radio-box-item-${idx}`">{{ item.label }}</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";

const props = defineProps({
  options: {
    type: Array as PropType<IRadio<any>[]>,
    default: () => [],
  },
  onChange: {
    type: Function as PropType<(value: any) => void>,
  },
  modelValue: {
    type: String,
    required: true,
  },
});

const val = ref("");
const emit = defineEmits(["update:modelValue"]);

// ----------------- F U N C T I O N ----------------- //

const _onChange = (e: any) => {
  props.onChange && props.onChange(e.target.value);
  emit("update:modelValue", e.target.value);
};
</script>

<style lang="scss" scoped>
.radio-box {
  display: flex;
  gap: var(--common-padding);
  padding-block: var(--common-padding);
  .radio-box-item {
    width: 80px;
    display: flex;
    justify-content: center;
    input {
      // 清除默认样式
      appearance: none;
      position: absolute;
    }
    label {
      display: block;
      width: 100%;
      text-align: center;
      padding: 3px;
      border-radius: var(--button-radius);
      border: 1px solid var(--button-border-light-color);
      transition: var(--common-transition);
    }

    &:hover {
      label {
        border-color: var(--common-color);
        color: var(--common-color);
      }
    }
    input:checked + label {
      border-color: var(--common-color);
      color: var(--common-color);
    }
  }
}
</style>
