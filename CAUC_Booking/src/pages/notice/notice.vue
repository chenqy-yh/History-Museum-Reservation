<template>
  <CommonLayout
    title="公告"
    :use-static-header="true"
    bg_url="https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/index_swaper_3.jpg"
  >
    <view class="main-content">
      <view class="pm-download" @click="downloadFile"> 申请书下载 </view>
    </view>
  </CommonLayout>
</template>

<script setup>
import CommonLayout from "../../layout/commonLayout/commonLayout.vue";
import Star from "../../components/star/star.vue";

const downloadFile = () => {
  uni.showLoading({
    title: "正在下载……",
  });
  wx.downloadFile({
    url: "https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/permission.docx",
    success(res) {
      if (res.statusCode == 200) {
        //隐藏加载框
        uni.hideLoading();
        console.log("res.statusCode", res);
        wx.shareFileMessage({
          fileName: "申请书.docx",
          filePath: res.tempFilePath,
          success(data) {
            uni.showToast({
              icon: "success",
              mask: true,
              title: "转发成功",
              duration: 2000,
            });
          },
          fail: console.error,
        });
      }
    },
    // fileName:'导出的文件名',
    fail: console.error,
  });
};
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
