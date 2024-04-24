<template>
  <div class="main-content">
    <img class="cover" :src="getAssetsImage('images/icon/error/503.png')" />
    <div class="tip">
      <p class="warning">503 Service Unavailable</p>
      <p class="connect">联系运维管理员:<div class="tel">13048451151</div></p>
    </div>
    <div class="button-area">
    <IconButton text="重新登陆" theme="light" :click="goLogin"></IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconButton from "@/components/button/iconButton.vue";
import { getAssetsImage } from "@/utils/static/pub-use";
import { router } from "@/router";

const goLogin = () => {
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.main-content {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  .cover {
    height: 300px;
    width: 300px;
    transition: var(--common-transition);
    &:hover{
        transform:scale(1.05);
    }
  }
  .tip {
    display:flex;
    flex-direction: column;
    gap: 10px;
    font-size: 20px;
    color: var(--text-primary-color);
    text-align: center;
    cursor: pointer;
   &:hover .connect .tel{
        transform:scale(1.05);
        color: var(--common-color);
    }
    .connect{
        display:flex;
        justify-content:center;
        .tel{
            width: 170px;
            transition: var(--common-transition); 
        }
    }
  }
}
</style>
