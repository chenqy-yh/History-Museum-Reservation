<template>
  <div class="add-user-block">
    <form class="form">
      <div class="form-item">
        <div class="form-title">用户名:</div>
        <IconInput v-model="add_user_info.username" :max-len="16"></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">密码:</div>
        <IconInput
          v-model="add_user_info.password"
          type="password"
          :max-len="16"
        ></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">确认密码:</div>
        <IconInput
          type="password"
          v-model="add_user_info.confirm_password"
          :max-len="16"
        ></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">昵称:</div>
        <IconInput v-model="add_user_info.nickname" :max-len="16"></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">手机号:</div>
        <IconInput v-model="add_user_info.tel" :max-len="11"></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">邮箱:</div>
        <IconInput v-model="add_user_info.mail" :max-len="100"></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">用户性别:</div>
        <div class="switch-box">
          <el-switch
            v-model="add_user_info.sex"
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
            v-model="add_user_info.status"
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
          v-model="add_user_info.remark"
          class="common-textarea"
        ></textarea>
      </div>
    </form>
    <div class="btn-group">
      <IconButton text="创建用户" @click="onAddUser"></IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconButton from "@/components/button/iconButton.vue";
import IconInput from "@/components/input/iconInput.vue";

import { useUserManagerStoreForSetup } from "@/store";
import { createUser } from "@/utils/api/user";
import {
isValid,
validConfirmPassword,
validLength,
validMail,
validNickName,
validPassword,
validPhone,
validSex,
validStatus,
validUserName,
} from "@/utils/fn/valid";
import { AxiosError } from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
import { reactive, ref } from "vue";
// -------------------- S T O R E -------------------- //

const userManagerStore = useUserManagerStoreForSetup();
const { show_drawer } = storeToRefs(userManagerStore);

const add_user_info = reactive({
  username: "",
  password: "",
  confirm_password: "",
  nickname: "",
  tel: "",
  mail: "",
  sex: "",
  status: "",
  remark: "",
});

const common_user_list = ref<IUser[]>([]);

// ----------------- F U N C T I O N ----------------- //

const onAddUser = () => {
  if (!checkUserInfo()) {
    return;
  }
  ElMessageBox.confirm("点击确认添加用户?", "确认通知", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
    autofocus: true,
  })
    .then(async () => {
      // 发送请求
      createUser(add_user_info)
        .then((res) => {
          if (res.status === 201) {
            ElMessage({
              type: "success",
              message: "添加用户成功",
            });
            show_drawer.value = false;
          } else {
            ElMessage({
              type: "error",
              message: "添加用户失败",
            });
            console.log(res);
          }
        })
        .catch((err: AxiosError) => {
          ElMessage({
            type: "error",
            message: (err.response?.data! as any).message || "添加用户失败",
          });
          console.log(err);
        })
        .finally(() => {});
    })
    .catch((err) => {
      console.log(err);
    });
};

const checkUserInfo = () => {
  if (
    isValid(validUserName(add_user_info.username), "用户名不合法") &&
    isValid(
      validLength(add_user_info.username, 8, 16),
      `用户名长度不合法，长度在8到16之间`
    ) &&
    isValid(validPassword(add_user_info.password), "密码不合法") &&
    isValid(
      validLength(add_user_info.password, 8, 16),
      "密码长度不合法，长度在8到16之间"
    ) &&
    isValid(
      validConfirmPassword(
        add_user_info.password,
        add_user_info.confirm_password
      ),
      "两次密码不一致"
    ) &&
    isValid(validNickName(add_user_info.nickname), "昵称不合法") &&
    isValid(
      validLength(add_user_info.nickname, 2, 16),
      "昵称长度不合法，长度在2到16之间"
    ) &&
    isValid(validPhone(add_user_info.tel), "手机号不合法") &&
    isValid(validMail(add_user_info.mail), "邮箱不合法") &&
    isValid(
      validLength(add_user_info.mail, 8, 100),
      "邮箱长度不合法，，长度在8到100之间"
    ) &&
    isValid(validSex(add_user_info.sex), "性别不合法") &&
    isValid(validStatus(add_user_info.status), "用户状态不合法") &&
    isValid(
      validLength(add_user_info.remark, 0, 150),
      "备注长度不合法，长度在0到200之间"
    )
  ) {
    return true;
  }
  return false;
};
</script>

<style lang="scss" scoped>
.add-user-block {
  display: grid;
  justify-items: center;
  grid-template-rows: max-content 1fr;
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
    margin-top: 40px;
    height: 100%;
  }
}
</style>
