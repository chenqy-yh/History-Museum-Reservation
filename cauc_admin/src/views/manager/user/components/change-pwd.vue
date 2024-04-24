<template>
  <div class="change-pwd-area">
    <form class="form">
      <div class="form-item">
        <div class="form-title">新密码:</div>
        <IconInput
          v-model="update_pwd_form.new_pwd"
          type="password"
          :max-len="16"
        ></IconInput>
      </div>
      <div class="form-item">
        <div class="form-title">确认密码:</div>
        <IconInput
          type="password"
          v-model="update_pwd_form.confirm_pwd"
          :max-len="16"
        ></IconInput>
      </div>
    </form>

    <div class="btn-group">
      <IconButton text="修改密码" @click="updateAdminPwd"></IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { PropType, onMounted, reactive, onBeforeUnmount } from "vue";
import { validConfirmPassword, validPassword, isValid } from "@/utils/fn/valid";
import { updateUserPwd } from "@/utils/api/user";
import { AxiosError } from "axios";
import { useUserStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";

// -------------------- P R O P S -------------------- //

const props = defineProps({
  userInfo: {
    type: Object as PropType<IUser>,
    required: true,
  },
});

// ----------------- C O N S T A N T ----------------- //

const update_pwd_form = reactive({
  new_pwd: "",
  confirm_pwd: "",
});

// -------------------- S T O R E -------------------- //

const userStore = useUserStoreForSetup();
const { show_drawer } = storeToRefs(userStore);

// ------------------- C I R C L E ------------------- //

onMounted(() => {
  console.log("change-pwd:", props.userInfo);
});

onBeforeUnmount(() => {
  update_pwd_form.new_pwd = "";
  update_pwd_form.confirm_pwd = "";
});

// ----------------- F U N C T I O N ----------------- //

// 修改
const checkIsValid = () => {
  if (
    isValid(validPassword(update_pwd_form.new_pwd), "新密码不合法") &&
    isValid(
      validConfirmPassword(
        update_pwd_form.new_pwd,
        update_pwd_form.confirm_pwd
      ),
      "确认密码不合法"
    )
  ) {
    return true;
  }
  return false;
};

// 修改用户密码
const updateAdminPwd = () => {
  if (!checkIsValid()) {
    return;
  }
  ElMessageBox.confirm("确认修改用户密码?", "确认通知", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
    autofocus: true,
  })
    .then(async () => {
      // 发送请求
      updateUserPwd(props.userInfo.id, {
        new_password: update_pwd_form.new_pwd,
        confirm_password: update_pwd_form.confirm_pwd,
      })
        .then((res) => {
          console.log(res);
          if (res.status === 201) {
            ElMessage({
              type: "success",
              message: "修改用户密码成",
            });
          } else {
            ElMessage({
              type: "error",
              message: "修改用户密码失败",
            });
            console.log(res);
          }
        })
        .catch((err: AxiosError) => {
          ElMessage({
            type: "error",
            message: (err.response?.data! as any).message || "修改用户密码失败",
          });
          console.log(err);
        })
        .finally(() => {
          show_drawer.value = false;
        });
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
