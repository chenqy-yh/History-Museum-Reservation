<template>
  <view class="img-upload">
    <view class="upload-img-block" @click="commitImg" v-if="!img_url">
      <image mode="aspectFit" src="/static/img/icon/camera.png"></image>
    </view>

    <view class="sub-img" v-else>
      <image
        v-show="!upload_loading"
        class="commit-pic"
        mode="aspectFit"
        :src="getBlurryImg(img_url)"
        @error="onPicError"
        @load="onImgLoad"
      >
      </image>
      <UploadLoading :show="upload_loading"></UploadLoading>
      <image
        v-show="!upload_loading"
        class="del"
        src="/static/img/icon/close.png"
        mode="aspectFit"
        @click="img_url = null"
      >
      </image>
    </view>
  </view>
</template>

<script setup>
import UploadLoading from "../loading/uploadLoading.vue";

import { ref } from "vue";
import { useOrderStore } from "../../store";
import { storeToRefs } from "pinia";
import { upload_auth_img } from "../../utils/api";
import { throttle } from "../../utils/fn";
import { RES_REQ_DURATION } from "../../utils/config/constants";
import { getBlurryImg } from "../../utils/fn";

const orderStore = useOrderStore();
const { img_url } = storeToRefs(orderStore);
const upload_loading = ref(false);

const commitImg = throttle(() => {
  upload_loading.value = true;
  upload_auth_img()
    .then((res) => {
      if (res.statusCode !== 201) {
        uni.showToast({
          title: "图片上传失败",
          icon: "none",
        });
        return;
      }
      // 等待腾讯云上传图片
      setTimeout(() => {
        img_url.value = res.data;
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
      uni.showToast({
        title: "图片上传失败",
        icon: "none",
      });
    });
}, RES_REQ_DURATION);

const onImgLoad = () => {
  upload_loading.value = false;
};

const onPicError = () => {
  uni.showToast({
    title: "图片上传失败",
    icon: "none",
  });
  img_url.value = "";
};
</script>

<style lang="scss" scoped>
.img-upload {
  height: 100%;
  .upload-img-block {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 2vw;
    background-color: #f4ede3;
    position: relative;
    image {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 30%;
    }
  }
  .sub-img {
    background-color: #f4ede3;
    border-radius: 2vw;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100%;
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
</style>
