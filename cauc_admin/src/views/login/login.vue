<template>
  <div class="main-content">
    <div class="left-content">
      <div class="bgitem"></div>
      <div class="bgitem"></div>
      <div class="bgitem"></div>
      <div class="bgitem"></div>
      <img
        class="left-cover"
        :src="getAssetsImage('svg/login/cover_0.svg')"
        alt=""
      />
    </div>
    <div class="right-content">
      <div class="top-area">
        <Brand />
        <div class="login-title">LEAF ADMIN</div>
      </div>
      <form class="login-form">
        <IconInput
          left_icon="ri-user-3-fill"
          v-model="input_username"
          placeholder="username"
        ></IconInput>
        <IconInput
          left_icon="ri-key-fill"
          v-model="input_password"
          placeholder="password"
          type="password"
        ></IconInput>
        <IconInput
          left_icon="ri-shield-cross-line"
          v-model="input_code"
          placeholder="verification"
          type="text"
        ></IconInput>
        <div class="remember-me">
          <input
            type="checkbox"
            id="custom-checkbox"
            :checked="true"
            label="Remember me"
          />
          <label for="custom-checkbox">Remember Me</label>
        </div>
        <CommonButton
          text="Login"
          :click="login"
          v-loading="loading_login"
        ></CommonButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Brand from "@/components/brand/brand.vue";
import CommonButton from "@/components/button/commonButton.vue";
import IconInput from "@/components/input/iconInput.vue";
import { router } from "@/router";
import { useUserStoreForSetup } from "@/store";
import { getUserPersssionRoutes } from "@/utils/api/permission";
import { getAssetsImage } from "@/utils/static/pub-use";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import { setupDynamicRoutes } from "@/router/modules";

const loading_login = ref(false);

const input_username = ref("a1140710816");
const input_password = ref("yinhan123");
const input_code = ref();

const userStore = useUserStoreForSetup();

onMounted(() => {
  // reset routes
});

// const login = async () => {
//   loading_login.value = true;
//   const is_login = await userStore.login({
//     input_username: input_username.value,
//     input_password: input_password.value,
//     verfiyCode: input_code.value,
//   });
//   loading_login.value = false;
//   if (is_login) {
//     ElMessage.success("登陆成功");

//     const res = await getUserPersssionRoutes();
//     // 动态添加路由权限
//     await setupDynamicRoutes(res.data);

//     // router.push({ name: "Home" });
//   } else {
//     ElMessage.error("登陆失败");
//   }
// };
</script>

<style lang="scss" scoped>
.main-content {
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: var(--bg-primary-color);

  .left-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    position: relative;
    // 选择1，3元素
    .bgitem:nth-child(1),
    .bgitem:nth-child(3) {
      background-color: var(--bg-left-container-color);
    }

    .bgitem:nth-child(1) {
      position: relative;
      &::before {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        background-color: var(--bg-primary-color);
        border-bottom-left-radius: 100%;
        border-top-left-radius: none;
      }
    }
    .bgitem:nth-child(4) {
      position: relative;
      &::before {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        background-color: var(--bg-left-container-color);
        border-top-right-radius: 100%;
        border-bottom-right-radius: none;
      }
    }
    .left-cover {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40%;
      height: 40%;
      object-fit: cover;
    }
  }
  @media screen and (max-width: 1024px) {
    & {
      grid-template-columns: 1fr;
    }
    .left-content {
      display: none;
    }
  }
  .right-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2vh;
    .top-area {
      display: flex;
      align-items: center;
    }
    .login-form {
      height: max-content;
      border-radius: var(--common-radius);
      min-width: 300px;
      width: 50%;
      border: 1.5px solid var(--common-color);
      padding: var(--common-padding-2);
      display: flex;
      flex-direction: column;
      gap: 2vh;
      .remember-me {
        display: flex;
        align-items: center;
        input {
          margin-right: 1vw;
        }
      }
    }
  }
}
</style>
