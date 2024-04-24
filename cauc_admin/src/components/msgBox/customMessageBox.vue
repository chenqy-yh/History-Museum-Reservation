<template>
  <TransitionGroup name="fade" tag="div">
    <div v-if="show" class="mask" key="1" @click="_onCancel"></div>
    <div
      class="main-content"
      v-if="show"
      key="2"
      :style="main_content_style"
      :class="{
        dark: theme === ThemeEnum.Dark,
        light: theme === ThemeEnum.Light,
      }"
    >
      <div class="title">{{ title }}</div>
      <div>{{ message }}</div>
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
import { computed, onMounted, ref } from "vue";

enum ThemeEnum {
  Dark = "dark",
  Light = "light",
}

const show = ref(false);

const props = defineProps({
  // data
  title: {
    type: String,
    default: "Tips",
  },
  message: {
    type: String,
    default: "this is content",
  },
  cancelName: {
    type: String,
    default: "Cancel",
  },
  confirmName: {
    type: String,
    default: "Confirm",
  },
  theme: {
    type: String,
    default: ThemeEnum.Dark,
  },
  //callback
  showCancel: {
    type: Boolean,
    default: true,
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },

  onCancel: {
    type: Function as any,
    default: () => {},
  },
  onConfirm: {
    type: Function as any,
    default: () => {},
  },

  // css
  width: {
    type: String,
    default: "400px",
  },
  height: {
    type: String,
    default: "300px",
  },
});

const main_content_style = computed(() => {
  return {
    width: props.width,
    height: props.height,
  };
});

onMounted(() => {
  show.value = true;
});

// fn

const _onCancel = () => {
  show.value = false;
  setTimeout(() => {
    props.onCancel();
  }, 500);
};
const _onConfirm = () => {
  show.value = false;
  setTimeout(() => {
    props.onConfirm();
  }, 500);
};
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(20, 20, 20, 0.5);
  z-index: 9998;
}
.main-content.dark {
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
      &:hover {
        filter: brightness(0.95);
      }
      &.confirm {
        background-color: #00a8ff;
      }
      &.cancel {
        border: 1px solid black;
        color: black;
      }
    }
  }
}
.main-content {
  z-index: 9999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  // background-color: #141414;
  //   box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
  //     rgba(0, 0, 0, 0.22) 0px 15px 12px;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
  // color: #f4f4f4;
  font-size: 18px;
  border-radius: 4px;
  display: grid;
  grid-template-rows: 30px 1fr 30px;
  gap: 10px;
  .btn-group {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    button {
      margin-left: 10px;
      padding: 5px 10px;
      border: none;
      border-radius: 5px;
      color: #fefefe;
      font-size: 14px;
      width: 80px;
      cursor: pointer;
    }
  }
}
</style>
