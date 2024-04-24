<template>
  <StatusBlock
    :status_idx="status_idx"
    :status_desc_list="status_desc_list"
    :cb="click"
    :clickable="clickable"
    :opacity="status_idx === 0?1:0.5"
  >
    <view class="cn-date title-ff"> {{ day_desc }} </view>
    <view class="num-date"> {{ month }}月{{ day }}日 </view>
  </StatusBlock>
</template>

<script setup>
import { ref, watch } from "vue";
import { createNoteForDateString } from "../../utils/fn/index";
import StatusBlock from "./statusBlock.vue";
const props = defineProps({
  date: {
    type: String,
    default: "09-15",
  },
  cb: {
    type: Function,
    default: () => {},
  },
  full: {
    type: Boolean,
    default: true,
  },
  close: {
    Boolean,
    default: false,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
  status_idx: {
    type: Number,
    default: 0,
  },
});

const month = ref("");
const day = ref("");
const day_desc = ref("");

const status_desc_list = ref(["可订", "约满", "闭馆"]);

const click = () => {
  if (!props.clickable) return;
  props.cb();
};

watch(
  () => props.date,
  (val) => {
    const [y, m, d] = val.split("-");
    month.value = m;
    day.value = d;
    day_desc.value = createNoteForDateString(m + "-" + d);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.cn-date {
  font-size: 13px;
  color: #5a4822;
}
.num-date {
  font-size: 11px;
  color: #5a4822;
}
</style>
