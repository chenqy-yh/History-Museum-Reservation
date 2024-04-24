<template>
  <Drawer v-model="show">
    <view class="container">
      <view class="header title-ff">
        <view @click="() => close_drawer(false)"> 取消 </view>
        <!-- <view> 选择所属学院 </view> -->
        <view @click="() => close_drawer(true)"> 确认 </view>
      </view>
      <view class="choose-visit-type" @click="">
        <view
          class="choose-item title-ff"
          :class="{
            active: item.active,
          }"
          v-for="(item, idx) in choose_item_list"
          :key="idx"
          @click="() => onChooseType(idx)"
        >
          {{ item.label }}
        </view>
      </view>
      <view class="choose-content">
        <swiper
          class="swiper title-ff"
          v-if="choose_item_list[0].active"
          choose-visit-type
          :indicator-dots="false"
          :autoplay="false"
          :vertical="true"
          :current="current_id"
          easing-function="linear"
          :display-multiple-items="3"
          previous-margin="60px"
          @change="swiperChange"
        >
          <swiper-item v-for="(item, idx) in list" :key="idx">
            <view class="swiper-item">{{ item }}</view>
          </swiper-item>
        </swiper>
        <view v-else>
          <view class="section">
            <view class="title title-ff"> 团体名称 </view>
            <view>
              <CustomInput
                placeholder="请输入团体名称"
                :max-len="15"
                type="text"
                :on-input="onGroupNameInput"
              ></CustomInput>
            </view>
          </view>
        </view>
      </view>
    </view>
  </Drawer>
</template>

<script setup>
import CustomInput from "../input/customInput.vue";
import Drawer from "../../components/drawer/drawer.vue";
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  onPicker: {
    type: Function,
  },
  list: {
    type: Array,
  },
});

const emits = defineEmits(["update:modelValue"]);

const show = ref(props.showPicker);

const val = ref(0);

const current_id = ref(0);

const choose_type = ref(0);

const choose_item_list = ref([
  {
    label: "在校人员",
    active: true,
  },
  {
    label: "非在校人员",
    active: false,
  },
]);
const groupName = ref("");

const choose_val = ref(
  choose_type.value === 0 ? props.list[val.value] : groupName.value
);

watch(
  () => props.modelValue,
  (newVal) => {
    show.value = newVal;
  },
  {
    immediate: true,
  }
);

watch(
  () => show.value,
  (newVal) => {
    emits("update:modelValue", newVal);
  }
);

//fn

const close_drawer = (is_submit) => {
  if (
    is_submit &&
    (choose_val.value === undefined || choose_val.value === "")
  ) {
    uni.showToast({
      title: "请选择团体名称",
      icon: "none",
    });
    return;
  }
  show.value = false;
  emits("update:modelValue", false);
  props.onPicker(
    is_submit
      ? {
          choose_value: choose_val.value,
          choose_type: choose_type.value,
        }
      : ""
  );
};

const swiperChange = (e) => {
  val.value = e.detail.current;
  choose_val.value = props.list[val.value];
};

// 选择类型
const onChooseType = (idx) => {
  choose_type.value = idx;
  choose_item_list.value.forEach((item, index) => {
    item.active = index === idx;
  });
  choose_val.value =
    choose_type.value === 0 ? props.list[val.value] : groupName.value;
};

const onGroupNameInput = (e) => {
  choose_val.value = e.detail.value;
};
</script>

<style lang="scss" scoped>
.section {
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 30vw 1fr;
  align-items: center;
  padding-block: 2vw;
  border-block: 1.5px solid #a39176;
  .title {
    border: 1.5px solid #a39176;
    width: max-content;
    padding: 2vw;
  }
  .picker-btn {
    width: max-content;
    border: 1px solid #cebe9e;
    border-radius: 1vw;
    background-color: transparent;
    color: #b3a486;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    margin: 0;
  }
}

.container {
  box-sizing: border-box;
  height: 40vh;
  background-color: #f4ede3;
  border-radius: 2vw;
  padding: 4vw;
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  align-items: center;
  gap: 2vw;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    color: #5a4822;
    font-weight: 600;
    height: max-content;
  }
  .choose-visit-type {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
    box-sizing: border-box;
    overflow: hidden;
    .choose-item {
      padding-block: 2vw;
      border: 1.5px solid #5a4822;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      font-weight: 600;
      color: #5a4822;
      &.active {
        background-color: #5a4822;
        color: #f4ede3;
      }
      &:nth-child(1) {
        border-top-left-radius: 2vw;
        border-bottom-left-radius: 2vw;
      }
      &:last-child {
        border-top-right-radius: 2vw;
        border-bottom-right-radius: 2vw;
      }
    }
  }

  .choose-content {
  }
  .swiper {
    height: 150px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 40%;
      left: 0;
      width: 100%;
      height: 20%;
      background-color: #00000022;
      border-radius: 2vw;
    }
    .swiper-item {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
