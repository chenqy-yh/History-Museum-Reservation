<template>
  <view class="main-content">
    <button @click="show = true">show drawer</button>
    <Picker v-model="show" :on-picker="onPicker" :list="college_list"></Picker>
  </view>
</template>

<script setup>
import Picker from "../../components/picker/picker.vue";
import { ref } from "vue";

// ----------------- C O N S T A N T ----------------- //
const show = ref(false);
const college = ref("");
const org_type = ref("");
const college_list = ref([
  "计算机科学与技术学院",
  "交通科学与工程学院",
  "空中交通管理学院",
  "航空工程学院",
  "中欧航空工程学院",
  "电子信息与自动化学院",
  "理学院",
  "经济与管理学院",
  "飞行分校",
  "乘务学院",
  "",
  "",
]);

// ----------------- F U N C T I O N ----------------- //
const onPicker = (choose_obj) => {
  console.log(choose_obj);
  college.value = choose_obj.choose_value;
  org_type.value = choose_obj.choose_type;
};
</script>

<style lang="scss" scoped>
.main-content {
}
</style>
