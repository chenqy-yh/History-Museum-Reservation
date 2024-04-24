<template>
  <!-- <Dialog
    title="新增引导员"
    theme="light"
    v-model="show_add_guide_dialog"
    height="50vh"
    :cancel-name="'取消'"
    :confirm-name="'添加'"
    :on-confirm="onAddGuide"
  > -->
  <div class="guide-block">
    <form class="guide-form">
      <div class="form-item">
        <div class="form-title">姓名:</div>
        <IconInput v-model="add_guide_info.name" :max-len="10"></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">工号:</div>
        <IconInput v-model="add_guide_info.staff_id" :max-len="16"></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">部门:</div>
        <IconInput v-model="add_guide_info.group" :max-len="16"></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">电话:</div>
        <IconInput v-model="add_guide_info.tel" :max-len="11"></IconInput>
      </div>
      <el-button type="primary" class="add-btn" @click="onAddGuide"
        >添加解说员</el-button
      >
    </form>
  </div>
  <!-- </Dialog> -->
</template>

<script setup lang="ts">
import IconInput from "@/components/input/iconInput.vue";
import { reactive, ref } from "vue";

import { useGuideStoreForSetup } from "@/store";
import { createGuide, getGuideList } from "@/utils/api/guide";
import {
  isValid,
  validLength,
  validNickName,
  validPhone,
} from "@/utils/fn/valid";
import { ElMessage, ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";

// -------------------- P R O P S -------------------- //

const guide_store = useGuideStoreForSetup();
const { guide_list, show_drawer, show_add_guide_dialog } =
  storeToRefs(guide_store);

const add_guide_info = reactive({
  name: "",
  staff_id: "",
  group: "",
  tel: "",
});

// ----------------- F U N C T I O N ----------------- //
// 添加引导员
const onAddGuide = () => {
  return new Promise<void>((resolve, reject) => {
    if (checkGuideInfo(add_guide_info)) {
      ElMessageBox.confirm("点击确认添加引导员?", "确认通知", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "info",
        autofocus: true,
      })
        .then(async () => {
          ElMessage({
            type: "success",
            message: "添加用户成功",
          });
          resolve();
          //发送请求
          const res = await createGuide(add_guide_info);
          console.log("onAddGuide:", res);

          if (res.status === 201) {
            show_drawer.value = false;
            //清空表单
            resetAddGuideForm();
            // 重新获取用户列表
            await queryGuideList();
            resolve();
          } else {
            reject(true);
          }
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    } else {
      reject();
    }
  });
};

// 获取guide列表
const queryGuideList = async () => {
  try {
    guide_list.value = (await getGuideList()).data;
  } catch (error) {
    console.log(error);
  }
};

// 重置add guide form
const resetAddGuideForm = () => {
  add_guide_info.name = "";
  add_guide_info.staff_id = "";
  add_guide_info.group = "";
  add_guide_info.tel = "";
};

// 检测guide信息是否合法
const checkGuideInfo = (guide_info: IGuide) => {
  if (
    isValid(validNickName(guide_info.name), "姓名不合法") &&
    isValid(
      validLength(guide_info.name, 2, 10),
      "昵称长度不合法，长度在2到10之间"
    ) &&
    isValid(
      validLength(guide_info.staff_id, 1, 16),
      "工号长度不合法，长度在1到16之间"
    ) &&
    ((guide_info.group &&
      isValid(
        validLength(guide_info.group, 1, 16),
        "部门长度不合法，长度在1到16之间"
      )) ||
      guide_info.group === "") &&
    isValid(validPhone(guide_info.tel), "手机号不合法")
  ) {
    return true;
  }
  return false;
};
</script>

<style lang="scss" scoped>
.guide-block {
  display: flex;
  justify-content: center;
  .guide-form {
    .form-item {
      display: grid;
      grid-template-columns: 80px 1fr;
      align-items: center;
      width: 100%;
      padding: var(--common-padding);
      padding-left: 0;
    }
    .switch-box {
      width: max-content;
    }
    .add-btn {
      display: block;
      margin-top: 30px;
      margin-inline: auto;
    }
  }
}
</style>
