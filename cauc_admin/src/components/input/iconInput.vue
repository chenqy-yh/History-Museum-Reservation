<template>
  <div
    class="icon-input-content"
    :class="{
      focus: input_focus,
      useFrontIcon: left_icon,
    }"
    :style="icon_input_content_style"
  >
    <i :class="left_icon" class="icon-1"></i>
    <input
      class="input"
      :placeholder="placeholder"
      :value="modelValue"
      :type="type === 'password' ? (show_pwd ? 'text' : 'password') : type"
      @focus="on_focus"
      @blur="on_blur"
      @input="on_input"
      :name="type === 'password' ? 'leaf-admin-password' : 'leaf-admin-text'"
      autocomplete="leaf-admin-password"
      :maxlength="maxLen ? maxLen : 200"
    />
    <Transition name="fade">
      <i
        v-show="modelValue"
        class="ri-close-circle-line ri-sm"
        :class="{
          'icon-2': type === 'password',
          'icon-3': type !== 'password',
        }"
        @click="clear"
      ></i>
    </Transition>
    <i
      v-show="type === 'password'"
      class="ri-eye-line icon-3"
      :class="{
        'ri-eye-fill': show_pwd,
        'ri-eye-off-line': !show_pwd,
      }"
      @click="toggle_show_pwd"
    ></i>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  type: {
    type: String as () => "text" | "password",
    default: "text",
  },
  width: {
    type: String,
    default: "100%",
  },
  placeholder: {
    type: String,
  },
  modelValue: {
    type: String,
    default: "",
  },
  left_icon: {
    type: String,
    default: "",
  },
  maxLen: Number,
});
const input_focus = ref(false);

// pwd
const show_pwd = ref(false);
const emit = defineEmits(["update:modelValue"]);

const icon_input_content_style = computed(() => {
  return {
    width: props.width,
  };
});

// ------------------- C I R C L E ------------------- //

// fn
const on_input = (e: Event) => {
  emit("update:modelValue", (e.target as any).value);
};

const on_focus = () => {
  input_focus.value = true;
};
const on_blur = () => {
  input_focus.value = false;
};

const clear = () => {
  emit("update:modelValue", "");
};

const toggle_show_pwd = () => {
  show_pwd.value = !show_pwd.value;
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.icon-input-content {
  border: 1.5px solid #e5e5e5;
  border-radius: var(--common-radius);
  padding-block: 1.2vh;
  display: grid;
  grid-template-columns: 1fr 20px 40px;
  grid-template-areas: " input icon-2 icon-3";
  justify-items: center;
  align-items: center;
  align-content: center;
  transition: all 0.3s;
  height: 35px;

  &.useFrontIcon {
    grid-template-columns: 40px 1fr 20px 40px;
    grid-template-areas: "icon-1 input icon-2 icon-3";
    input {
      padding-inline: 0;
    }
  }

  &.focus {
    border-color: var(--common-input-focus-color);
    transition: all 0.3s;
  }
  input {
    border: none;
    inset: none;
    width: 100%;
    height: max-content;
    font-size: 16px;
    padding-inline: var(--common-padding);
    &:focus {
      outline: none;
    }
    grid-area: "input";
  }
  .icon-1 {
    grid-area: icon-1;
  }
  .icon-2 {
    grid-area: icon-2;
    cursor: pointer;
  }
  .icon-3 {
    grid-area: icon-3;
    cursor: pointer;
  }
}
</style>
