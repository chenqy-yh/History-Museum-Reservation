<template>
  <TransitionGroup name="fade" tag="div" class="xxx">
    <div class="mask" v-if="modelValue" key="1" @click.prevent="close"></div>
    <div
      class="main-content"
      v-if="modelValue"
      key="2"
      :style="main_content_style"
      :class="{
        dark: theme === ThemeEnum.Dark,
        light: theme === ThemeEnum.Light,
      }"
    >
      <div class="header" :style="titleStyle">
        <div class="title">{{ title }}</div>
        <div class="btn-group">
          <IconButton
            icon="ri-fullscreen-line"
            theme="simple"
            :click="toggleScreenFull"
          ></IconButton>
          <IconButton
            icon="ri-close-fill ri-lg"
            theme="simple"
            :click="close"
          ></IconButton>
        </div>
      </div>
      <!-- body slot -->
      <div class="content">
        <slot></slot>
      </div>
      <!-- <div>this is content</div> -->
      <div class="btn-group">
        <button v-if="showCancel" class="cancel" @click="_onCancel">
          {{ cancelName }}
        </button>
        <button v-if="showConfirm" class="confirm" @click="_onConfirm">
          {{ confirmName }}
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import IconButton from "../button/iconButton.vue";

import { useSlots, ref, reactive, computed, PropType } from "vue";
import { ThemeEnum } from "../../utils/enum/theme.enum";

const props = defineProps({
  title: {
    type: String,
    default: "Tips",
  },
  titleStyle: {
    type: Object,
    default: {},
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "400px",
  },
  height: {
    type: String,
    default: "300px",
  },
  theme: {
    type: String as () => "light" | "dark",
    default: ThemeEnum.Dark,
  },
  cancelName: {
    type: String,
    default: "Cancel",
  },
  confirmName: {
    type: String,
    default: "Confirm",
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  onCancel: {
    type: Function as PropType<() => Promise<any>>,
  },
  onConfirm: {
    type: Function as PropType<() => Promise<any>>,
  },
  backgroundColor: {
    type: String,
    default: "#141414",
  },
  showTop: {
    type: Boolean,
    default: false,
  },
});

const full_screen = ref(false);

const defaultSlot = !!useSlots().default;
const emit = defineEmits(["update:modelValue"]);

// main content style
const main_content_style = computed(() => {
  return {
    "grid-template-rows":
      props.title === ""
        ? "auto-fill"
        : defaultSlot
        ? "40px 1fr 30px"
        : "1fr 30px",
    width: full_screen.value ? "100vw" : props.width,
    height: full_screen.value ? "100vh" : props.height,
  };
});


// ----------------- F U N C T I O N ----------------- //

const close = () => {
  emit("update:modelValue", false);
  full_screen.value = false;
};

const toggleScreenFull = () => {
  full_screen.value = !full_screen.value;
};

const _onCancel = async () => {
  await props.onCancel?.();
  close();
};

const _onConfirm = async () => {
  try {
    await props.onConfirm?.();
    close();
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(20, 20, 20, 0.5);
  z-index: 9998; //不能动
}

.dark {
  background-color: #141414;
  color: #f4f4f4;

  .btn-group {
    color: white;
    button {
      &:hover {
        filter: brightness(0.95);
      }
      &.confirm {
        background-color: #00a8ff;
        color: #ffffff;
      }
      &.cancel {
        border: 1px solid #666;
        color: #000000;
      }
    }
  }
}

.main-content.light {
  background-color: #fefefe;
  color: black;
  .btn-group {
    color: white;
    button {
      &.confirm {
        color: var(--common-color);
        border: 1px solid var(--common-color);
        background-color: var(--bg-primary-color);
        &:hover {
          background-color: var(--button-primary-bg-color);
          color: var(--bg-primary-color);
          transition: var(--common-transition);
        }
      }
      &.cancel {
        border: 1px solid black;
        color: black;
        &:hover {
          filter: brightness(0.95);
        }
      }
    }
  }
}

.main-content {
  z-index: 9999; //不能动
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: var(--common-padding);
  padding-top: 0;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  font-size: 18px;
  border-radius: 4px;
  display: grid;
  grid-template-rows: 30px 1fr 30px;
  gap: 10px;

  transition: var(--common-transition);

  .content {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--common-padding);
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #fefefe;
    border-bottom: 1px solid #eee;
    .title {
      font-size: 18px;
      font-weight: 600;
    }
    .btn-group {
      display: flex;
      gap: var(--common-padding);
    }
  }

  .btn-group {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    button {
      margin-left: 10px;
      padding: 5px 10px;
      border: none;
      font-size: 14px;
      width: 80px;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
