<template>
  <div class="main-content">
    <label v-for="(item, index) in items" :key="index">
      <div class="form-control">
        <input
          class="check"
          type="checkbox"
          v-model="selectedItems"
          :value="item.value"
          @change="handleCheckboxChange"
        />
        <div class="text">
          {{ item.label }}
        </div>
      </div>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue";

const props = defineProps({
  items: {
    type: Array as () => Item<number>[],
    default: () => [],
  },
  change: {
    type: Function as PropType<(e: any) => void>,
    default: () => {},
  },
});

const selectedItems = ref([]);
const handleCheckboxChange = () => {
  return props.change(selectedItems.value);
};
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.form-control {
  display: flex;
  width: 80px;
  position: relative;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--common-transition);
  padding: 4px;

  cursor: pointer;

  &:hover {
    // background-color: var(--common-color);
    transition: var(--common-transition);
    .text {
      color: var(--common-color);
    }
    .check {
      border-color: var(--common-color);
    }
  }
  .text {
    z-index: 9;
    color: #444;
    transition: var(--common-transition);
  }
  .check {
    z-index: 8;
    appearance: none;
    -webkit-appearance: none;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: 1.5px solid var(--button-border-light-color);
    border-radius: 5px;
    transition: var(--common-transition);
    &:checked {
      // background-color: var(--common-color);
      // 选择兄弟元素 .text
      border-color: var(--common-color);
      & ~ .text {
        color: var(--common-color);
      }
    }
  }
}
</style>
