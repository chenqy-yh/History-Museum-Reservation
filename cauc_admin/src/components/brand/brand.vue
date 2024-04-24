<template>
  <div class="container" :style="container_style"></div>
</template>
<script setup lang="ts">
import { PropType, computed, onMounted } from "vue";
import { ref } from "vue";

const enum _Size {
  small = 0.4,
  normal = 1,
  large = 1.5,
}

const normal_bg_size = 11;
const normal_size = 9;

const props = defineProps({
  size: {
    type: String as PropType<"small" | "normal" | "large">,
  },
});

const _scale = ref(1);
const _size = ref();
const _bg_size = ref();

const container_style = computed(() => {
  return {
    width: _bg_size.value + "vh",
    height: _bg_size.value + "vh",
    backgroundSize: `${_size.value}vh,${_size.value}vh`,
  };
});

onMounted(() => {
  _scale.value =
    props.size === "large"
      ? _Size.large
      : props.size === "small"
      ? _Size.small
      : _Size.normal;
  _size.value = normal_size * _scale.value;
  _bg_size.value = normal_bg_size * _scale.value;
});
</script>

<style lang="scss" scoped>
.container {
  background-image: url("../../assets/images/icon/brand/leaf_top.png"),
    url("../../assets/images/icon/brand/leaf_bot.png");
  background-repeat: no-repeat;
  background-blend-mode: luminosity;
  background-position: 0 0, right bottom;
}
</style>
