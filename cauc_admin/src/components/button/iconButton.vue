<template>
  <div
    class="_button"
    ref="_ref"
    :class="{
      default: theme === 'default',
      light: theme === 'light',
      simple: theme === 'simple',
      _border: border,
      active: props.able,
    }"
    @click.stop="_click"
  >
    <i :class="icon" class="icon" v-if="icon !== ''"></i>
    <button ref="_button_ref" v-show="text !== ''">{{ text }}</button>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { PropType, onBeforeMount, onMounted, ref } from "vue";

const props = defineProps({
  able: {
    type: Boolean,
    default: true,
  },
  msg: {
    type: String,
  },
  theme: {
    type: String as () => "default" | "light" | "simple",
    default: "default",
  },
  icon: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  border: {
    type: Boolean,
    default: false,
  },
  click: Function as PropType<(event: MouseEvent) => void>,
});

const _ref = ref();
const _button_ref = ref();

onBeforeMount(() => {});

const _click = (e: any) => {
  if (!props.able) {
    props.msg && ElMessage.error(props.msg);
    e.stopPropagation();
    return;
  }
  props.click && props.click(e);
  // 阻止点击事件扩散
};
</script>

<style lang="scss" scoped>
._button {
  width: max-content;
  height: max-content;
  background-color: #409eff;

  border-radius: var(--common-radius);
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  gap: 5px;
  opacity: 0.5;
  &.active {
    opacity: 1;
    &.default {
      &:hover {
        filter: brightness(1.1);
      }
    }
    &.light {
      &:hover {
        border-color: #a9d4ff;
        .icon {
          color: #409eff;
        }
        button {
          color: #409eff;
        }
      }
    }
    &.simple {
      &:hover {
        border-color: #409eff;
        .icon {
          color: #409eff;
        }
        button {
          color: #409eff;
        }
      }
    }
  }

  cursor: pointer;
  transition: var(--common-transition);
  .icon {
    transition: var(--common-transition);
  }
  button {
    transition: var(--common-transition);
  }

  &.default {
    padding-block: 5px;
    padding-inline: 10px;
    border: 1px solid #409eff;

    .icon {
      font-size: 14px;
      color: #fefefe;
    }
    button {
      background-color: transparent;
      border: none;
      font-size: 14px;
      color: #fefefe;
    }
  }
  &.light {
    padding-block: 5px;
    padding-inline: 10px;
    background-color: #fefefe;
    border: 1px solid var(--button-border-light-color);

    .icon {
      font-size: 14px;
      color: #333;
    }
    button {
      background-color: transparent;
      border: none;
      font-size: 14px;
      color: #444;
    }
  }
  &.simple {
    background-color: transparent;
    &._border {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1.5px solid black;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .icon {
      color: black;
    }
  }
}
</style>
