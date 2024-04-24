<template>
  <SimpleLayout title="申请人信息">
    <view class="section">
      <view class="title-ff">
        预订人姓名
        <Star></Star>
      </view>
      <view>
        <CustomInput
          placeholder="请输入授权人姓名"
          :max-len="max_len_of_name"
          type="text"
          :on-input="bindPermissionName"
        ></CustomInput>
      </view>
    </view>
    <view class="section">
      <view class="title-ff">
        预订人电话
        <Star></Star>
      </view>
      <view>
        <CustomInput
          placeholder="请输入授权人电话"
          :max-len="11"
          type="number"
          :on-input="bindPermissionTel"
        ></CustomInput>
      </view>
    </view>
    <!-- 选择所属学院 -->
    <view class="section">
      <view class="title-ff">
        所属学院
        <Star></Star>
      </view>
      <view>
        <button class="picker-btn title-ff" @click="showPicker">
          {{ college || "请选择所属学院" }}
        </button>
      </view>
    </view>
    <view
      class="section-3"
      v-for="(_, idx) in choose_time_list.length"
      :key="idx"
    >
      <view class="section-top">
        <view class="size-title title-ff">
          <view>
            <view class="text"> 场次{{ idx + 1 }}人数 </view>
            <view class="time-desc">
              {{ "- " + timeToFrame(choose_time_list[idx]) + " -" }}
            </view>
          </view>
          <Star></Star>
        </view>
        <view>
          <CustomInput
            :placeholder="`请输入场次${idx + 1}人数`"
            :max-len="4"
            type="number"
            :on-input="(e) => bindSize(e, idx)"
          ></CustomInput>
        </view>
      </view>
    </view>
    <view class="section-3">
      <view
        class="section-top"
        :class="{
          full: !has_guide,
        }"
      >
        <view class="title-ff">
          需要讲解员
          <Star></Star>
        </view>
        <view>
          <CheckGroup
            :list="need_list"
            :checkable="has_guide"
            :cb="onChooseNeedTeacher"
            fail-msg="当前无讲解员可选"
          ></CheckGroup>
        </view>
      </view>
    </view>
    <view class="section-4">
      <view class="section-top">
        <view class="title-ff">
          授权书截图
          <Star></Star>
        </view>
        <view class="upload-type">
          <CheckGroup
            :list="permission_list"
            :cb="onTogglePermissionType"
          ></CheckGroup>
        </view>
      </view>

      <view class="section-bot">
        <view class="warning title-ff">
          <view class="left"> 提示 </view>
          <view class="fade" v-if="permission_list[0].active"
            >{{ warning[0] }}
          </view>
          <view class="fade" v-else>{{ warning[1] }} </view>
        </view>
        <UploadImg v-if="pm_type === 0"></UploadImg>
        <UploadPdf v-else></UploadPdf>
      </view>
    </view>

    <button
      class="next-step"
      :class="{
        active:
          permission_name &&
          permission_tel &&
          college &&
          size_list.length > 0 &&
          (img_url || pdf_url),
      }"
      @click="next_step"
    >
      下一步
    </button>
  </SimpleLayout>
  <Picker
    v-model="show_picker"
    :onPicker="onPicker"
    :list="college_list"
  ></Picker>
  <MessageBox v-model="show_msg_box">
    <view class="over-size-warning">
      <view class="warning-title"> 提示 </view>

      <view class="warning-content">
        单次预订不可超过{{ single_time_max_cap }}人，如有需求，请预订多场
      </view>
      <view> </view>
      <button @click="() => (show_msg_box = false)">知晓</button>
    </view>
  </MessageBox>
</template>
<script setup>
import CheckGroup from "../../components/checkbox/checkGroup.vue";
import CustomInput from "../../components/input/customInput.vue";
import MessageBox from "../../components/messageBox/messageBox.vue";
import Picker from "../../components/picker/picker.vue";
import Star from "../../components/star/star.vue";
import UploadImg from "../../components/upload/uploadImg.vue";
import UploadPdf from "../../components/upload/uploadPdf.vue";
import SimpleLayout from "../../layout/simpleLayout/simpleLayout.vue";

import { onReady } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { Order } from "../../model/order";
import { useOrderStore } from "../../store";
import { timeToFrame } from "../../utils/fn/index";
import CToast from "../../utils/fn/toast";

// -------------------- S T O R E -------------------- //
const orderStore = useOrderStore();
const {
  pm_type,
  img_url,
  pdf_url,
  permission_name,
  permission_tel,
  size_list,
  need,
  has_guide,
  college,
  org_type,
  choose_time_list,
  choose_time_idx_list,
} = storeToRefs(orderStore);

// ----------------- C O N S T A N T ----------------- //

const warning = ["图片上传格式仅为 jpg, png", "请将PDF文件上传至微信聊天中"];

// config
const single_time_max_cap = 60;
const max_len_of_name = 20;

// picker
const show_picker = ref(false);

// 学院列表 TODO 从后端获取
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

// 展示msgbox
const show_msg_box = ref(false);

const need_list = ref([
  {
    id: 1,
    name: "是",
    active: false,
  },
  {
    id: 2,
    name: "否",
    active: true,
  },
]);

const permission_list = ref([
  {
    id: 1,
    name: "IMG",
    active: true,
  },
  {
    id: 2,
    name: "PDF",
    active: false,
  },
]);

// ------------------- C I R C L E ------------------- //

onReady(() => {
  console.log("choose_time_list:", choose_time_list.value);
});

// ----------------- F U N C T I O N ----------------- //

//绑定授权人姓名
const bindPermissionName = (e) => {
  permission_name.value = e.target.value;
};

// 绑定授权人电话
const bindPermissionTel = (e) => {
  permission_tel.value = e.target.value;
};

// 绑定参观总人数
const bindSize = (e, idx) => {
  size_list.value[idx] = e.target.value;
};

// 获得组织名称
const onPicker = (choose_obj) => {
  console.log(choose_obj);
  college.value = choose_obj.choose_value;
  org_type.value = choose_obj.choose_type;
};

//展开选择大学下拉框
const showPicker = () => {
  show_picker.value = true;
};

// 选择是否需要讲解员
const onChooseNeedTeacher = (i) => {
  need.value = i == 0;
};

// 选择授权书类型
const onTogglePermissionType = (i) => {
  img_url.value = pdf_url.value = null;
  pm_type.value = i;
};

const next_step = () => {
  // 如果选择单场 且 人数大于60 弹出提示框
  if (
    choose_time_idx_list.value.length == 1 &&
    size_list.value[0] > single_time_max_cap
  ) {
    show_msg_box.value = true;
    return;
  }
  const order_dto = new Order();
  order_dto
    .setPermissionName(permission_name.value)
    .setNeed(need.value)
    .setOrgType(org_type.value)
    .setOrganize(college.value)
    .setPermissionTel(permission_tel.value)
    .setSizeList(size_list.value)
    .setSubPmType(pm_type.value === 0 ? "IMG" : "PDF")
    .setTimeIdxList(choose_time_idx_list.value)
    .setTimeList(choose_time_list.value)
    .setUrl(pm_type.value === 0 ? img_url.value : pdf_url.value);
  order_dto.checkValid();
  if (order_dto.errors.length > 0) {
    CToast.error(order_dto.errors[0]);
    return;
  }
  uni.navigateTo({
    url: "/pages/order/order_console",
  });
};
</script>
<style lang="scss" scoped>
.fade {
  opacity: 0.5;
  animation: fade 0.5s ease forwards;
  @keyframes fade {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
  }
}

.over-size-warning {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  gap: 2vw;
  .warning-title {
    font-size: 20px;
    font-weight: 600;
    color: #5a4822;
    padding-block: 2vh;
    text-align: center;
  }
  .warning-content {
    font-size: 15px;
    font-weight: 600;
    color: #5a4822;
    padding-block: 2vh;
    text-align: center;
  }
  button {
    width: 100%;
    height: 7vh;
    background: #cebe9e;
    border-radius: 1vw;
    color: #fffcf7;
    font-weight: 600;
    font-size: 20px;
  }
}

.visit-title {
  font-size: 22px;
  font-weight: 600;
  color: #5a4822;
  box-sizing: border-box;
  padding-block: 2vh;
  border-bottom: 1px solid #e3dac8;
}
.section {
  display: grid;
  grid-template-columns: 30vw 1fr;
  align-items: center;
  padding-block: 2vh;
  border-bottom: 1px solid #e3dac8;

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
.section-2 {
  width: 100%;
  display: grid;
  grid-template-rows: 6vh 30vh;
  .title-ff {
    display: flex;
    align-items: center;
  }
  .sub-img {
    background-color: #f4ede3;
    border-radius: 2vw;
    display: flex;
    justify-content: center;
    position: relative;
    .commit-pic {
      height: 100%;
    }
    .del {
      position: absolute;
      top: 2vw;
      right: 2vw;
      width: 5vw;
      height: 5vw;
    }
  }
}
.section-3 {
  padding-block: 2vh;
  border-bottom: 1px solid #e3dac8;
  .section-top {
    display: grid;
    align-items: center;
    grid-template-columns: 30vw 1fr;
    .size-title {
      display: flex;
      align-items: center;
      .text {
      }
      .time-desc {
        font-size: 11px;
      }
    }
    &.full {
      opacity: 0.5;
      user-select: none;
    }
  }
  .section-bot {
    margin-top: 2vh;
    display: grid;
    align-items: center;
    grid-template-columns: 30vw 1fr;
  }
}

.section-4 {
  width: 100%;
  display: grid;
  grid-template-rows: max-content 30vh;
  box-sizing: border-box;
  .section-top {
    display: grid;
    align-items: center;
    grid-template-columns: 30vw 1fr;
    padding-block: 4vw;
    .title-ff {
      display: flex;
      align-items: center;
    }
  }
  .section-bot {
    // 图片上传
    display: grid;
    grid-template-rows: max-content 1fr;
    .warning {
      box-sizing: border-box;
      padding-bottom: 4vw;
      display: grid;
      grid-template-columns: 20vw 1fr;
      align-items: center;
      .left {
        border: 1px solid #a08a5f;
        width: max-content;
        padding-inline: 4vw;
        padding-block: 1vw;
        border-radius: 1vw;
        font-weight: 600;
        font-size: 14px;
      }
    }
  }

  .sub-img {
    background-color: #f4ede3;
    border-radius: 2vw;
    display: flex;
    justify-content: center;
    position: relative;
    .commit-pic {
      height: 100%;
    }
    .del {
      position: absolute;
      top: 2vw;
      right: 2vw;
      width: 5vw;
      height: 5vw;
    }
  }
}

.next-step {
  margin-top: 4vw;
  border: none;
  width: 40vw;
  height: 7vh;
  background: #cebe9e;
  border-radius: 1vw;
  color: #fffcf7;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  font-weight: 600;
  font-size: 20px;

  &.active {
    opacity: 1;
  }
}
</style>
