<template>
  <div class="guide-block">
    <form class="guide-form">
      <div class="form-item">
        <div class="form-title">姓名:</div>
        <IconInput v-model="update_guide_info.name" :max-len="10"></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">工号:</div>
        <IconInput
          v-model="update_guide_info.staff_id"
          :max-len="16"
        ></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">部门:</div>
        <IconInput v-model="update_guide_info.group" :max-len="16"></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">电话:</div>
        <IconInput v-model="update_guide_info.tel" :max-len="11"></IconInput>
      </div>
      <el-button class="confirm-btn" type="primary" @click="onUpdateGuide"
        >确认</el-button
      >
    </form>
  </div>
</template>

<script setup lang="ts">
import { useGuideStoreForSetup } from "@/store";
import { getGuideList, updateGuide } from "@/utils/api/guide";
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
const { update_guide_info, guide_list, show_updete_guide_dialog } =
  storeToRefs(guide_store);

// ------------------- C I R C L E ------------------- //

// ----------------- F U N C T I O N ----------------- //
const onUpdateGuide = () => {
  return new Promise<void>((resolve, reject) => {
    if (checkGuideInfo(update_guide_info.value)) {
      ElMessageBox.confirm("点击确认修改引导员?", "确认通知", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "info",
        autofocus: true,
      })
        .then(async () => {
          ElMessage({
            type: "success",
            message: "修改用户成功",
          });
          resolve();
          //发送请求
          const res = await updateGuide(update_guide_info.value);
          if (res.status === 201) {
            //清空表单
            resetUpdateGuideForm();
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

// 重置update guide form
const resetUpdateGuideForm = () => {
  update_guide_info.value.id = -1;
  update_guide_info.value.name = "";
  update_guide_info.value.staff_id = "";
  update_guide_info.value.group = "";
  update_guide_info.value.tel = "";
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
    display: grid;
    gap: var(--common-padding);
    justify-items: center;
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
  }
}
</style>
