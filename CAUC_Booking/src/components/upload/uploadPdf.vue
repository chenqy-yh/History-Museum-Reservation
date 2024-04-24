<template>
  <view class="pdf-upload">
    <view class="upload-img-block" @click="commitPdf" v-if="!pdf_url">
      <image
        class="pdf"
        mode="aspectFit"
        src="/static/img/icon/pdf.png"
      ></image>
    </view>
    <view class="sub-pdf" v-else>
      <image
        v-show="!upload_loading"
        class="commit-pdf"
        mode="aspectFit"
        :src="getBlurryImg(pdf_url)"
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
        @click="pdf_url = null"
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
import { upload_auth_pdf } from "../../utils/api";
import { throttle } from "../../utils/fn";
import { RES_REQ_DURATION } from "../../utils/config/constants";
import { getBlurryImg } from "../../utils/fn";

const orderStore = useOrderStore();
const { pdf_url } = storeToRefs(orderStore);

const upload_loading = ref(false);


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

const commitPdf = throttle(() => {
  upload_loading.value = true;
  upload_auth_pdf()
    .then((res) => {
      if (res.statusCode !== 201) {
        uni.showToast({
          title: "PDF上传失败",
          icon: "none",
        });
        return;
      }
      pdf_url.value = res.data;
    })
    .catch((err) => {
      uni.showToast({
        title: "PDF上传失败",
        icon: "none",
      });
    });
}, RES_REQ_DURATION);
</script>

<style lang="scss" scoped>
.pdf-upload {
  height: 100%;
  position: relative;
  .upload-img-block {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 2vw;
    background-color: #f4ede3;
    position: relative;
    .pdf {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 30%;
    }
  }
  .sub-pdf {
    background-color: #f4ede3;
    border-radius: 2vw;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100%;
    .commit-pdf {
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
