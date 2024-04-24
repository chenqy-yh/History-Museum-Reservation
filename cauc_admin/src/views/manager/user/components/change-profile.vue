<template>
  <div class="change-pwd-area">
    <form class="form">
      <div class="form-item">
        <div class="form-title">昵称:</div>
        <IconInput
          v-model="update_profile_form.nickname"
          :max-len="16"
        ></IconInput>
      </div>
      <!-- <div class="form-item">
        <div class="form-title">手机号:</div>
        <IconInput v-model="update_profile_form.tel" :max-len="11"></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">邮箱:</div>
        <IconInput
          v-model="update_profile_form.mail"
          :max-len="100"
        ></IconInput>
      </div> -->
      <div class="form-item">
        <div class="form-title">用户性别:</div>
        <div class="switch-box">
          <el-switch
            v-model="update_profile_form.sex"
            inline-prompt
            active-text="男"
            inactive-text="女"
            :active-value="0"
            :inactive-value="1"
            size="large"
            width="60px"
            inactive-color="#e74c3c"
          />
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">用户状态:</div>
        <div class="switch-box">
          <el-switch
            v-model="update_profile_form.status"
            inline-prompt
            active-text="开启"
            inactive-text="禁用"
            :active-value="0"
            :inactive-value="1"
            size="large"
            width="60px"
            active-color="#2ecc71"
          />
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">备注:</div>
        <textarea
          maxlength="150"
          v-model="update_profile_form.remark"
          class="common-textarea"
        ></textarea>
      </div>
    </form>

    <div class="btn-group">
      <IconButton text="修改资料" @click="updateAdminProfile"></IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconButton from "@/components/button/iconButton.vue";
import IconInput from "@/components/input/iconInput.vue";

import { useUserStoreForSetup, useUserManagerStoreForSetup } from "@/store";
import { updateUserProfile } from "@/utils/api/user";
import {
  isValid,
  validLength,
  validMail,
  validNickName,
  validPhone,
  validSex,
  validStatus,
} from "@/utils/fn/valid";
import { AxiosError } from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
import {
  PropType,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";

// -------------------- P R O P S -------------------- //

const props = defineProps({
  userInfo: {
    type: Object as PropType<IUser>,
    required: true,
  },
});

// ----------------- C O N S T A N T ----------------- //

const update_profile_form = reactive({
  nickname: "",
  sex: 0,
  status: 0,
  remark: "",
});

// -------------------- S T O R E -------------------- //

const userStore = useUserStoreForSetup();
const userManagerStore = useUserManagerStoreForSetup();
const { show_drawer } = storeToRefs(userStore);
const { common_user_list } = storeToRefs(userManagerStore);
// ------------------- C I R C L E ------------------- //

watch(
  () => props.userInfo,
  (newVal) => {
    update_profile_form.nickname = newVal.nickname;
    update_profile_form.sex = newVal.sex;
    update_profile_form.status = newVal.status;
    update_profile_form.remark = newVal.remark;
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  update_profile_form.nickname = "";
  update_profile_form.sex = 0;
  update_profile_form.status = 0;
  update_profile_form.remark = "";
});

// ----------------- F U N C T I O N ----------------- //

// 修改
const checkUserInfo = () => {
  if (
    isValid(validNickName(update_profile_form.nickname), "昵称不合法") &&
    isValid(validSex(update_profile_form.sex.toString()), "性别不合法") &&
    isValid(
      validStatus(update_profile_form.status.toString()),
      "用户状态不合法"
    )
  ) {
    return true;
  }
  return false;
};
// 修改用户密码
const updateAdminProfile = () => {
  if (!checkUserInfo()) {
    return;
  }
  ElMessageBox.confirm("确认修改用户资料?", "确认通知", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
    autofocus: true,
  })
    .then(async () => {
      // 发送请求
      updateUserProfile(props.userInfo.id, {
        nickname: update_profile_form.nickname,
        remark: update_profile_form.remark,
        sex: update_profile_form.sex,
        status: update_profile_form.status,
      })
        .then((res) => {
          console.log(res);
          if (res.status === 201) {
            ElMessage({
              type: "success",
              message: "修改用户资料成功",
            });
            common_user_list.value.some((user) => {
              if (user.id === props.userInfo.id) {
                // 合并 用 update_profile_form来覆盖
                user = Object.assign(user, update_profile_form);
                return true;
              }
            });
            show_drawer.value = false;
          } else {
            ElMessage({
              type: "error",
              message: "修改用户资料失败",
            });
            console.log(res);
          }
        })
        .catch((err: AxiosError) => {
          ElMessage({
            type: "error",
            message: (err.response?.data! as any).message || "修改用户资料成功",
          });
          console.log(err);
        })
        .finally(() => {});
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>

<style lang="scss" scoped>
.change-pwd-area {
  height: 100%;
  // border: 1px solid red;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: var(--common-padding);

  .form {
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
  .btn-group {
    // border: 1px solid red;
    margin-top: 40px;
    height: 100%;
  }
}
</style>
