<template>
  <div class="awesome-btn">
    <div
      class="front"
      :style="{
        color: frontColor,
        background: frontBgColor,
        border: '1px solid #aaa',
      }"
    >
      {{ frontText }}
    </div>
    <div
      class="back"
      :style="{
        color: backColor,
        background: backBgColor,
      }"
    >
      {{ backText }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  backColor: {
    type: String,
    default: "#fefefe",
  },
  frontColor: {
    type: String,
    default: "#444444",
  },
  frontBgColor: {
    type: String,
    default: "transparent",
  },
  backBgColor: {
    type: String,
    default: "var(--common-color)",
  },
  backText: {
    type: String,
    default: "backText",
  },
  frontText: {
    type: String,
    default: "frontText",
  },
});
</script>

<style lang="scss" scoped>
.awesome-btn {
  height: 30px;
  width: max-content;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: var(--button-radius);
  .front {
    height: 100%;
    width: max-content;
    padding-inline: var(--common-padding);
    border-radius: var(--button-radius);
    transition: var(--common-transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .back {
    position: absolute;
    left: 0;
    top: -50%;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    overflow: hidden;
    transition: var(--common-transition);
    display: flex;
    align-items: center;
    justify-content: center;
    transition-delay: 0.3s;
    opacity: 0;
  }
  &:hover {
    .front {
      opacity: 0;
    }
    .back {
      top: 0;
      opacity: 1;
    }
  }
}
</style>
