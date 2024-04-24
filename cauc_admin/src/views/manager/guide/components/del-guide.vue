<template>
  <div class="main-content">
    <div class="header">
      <i class="ri-error-warning-line ri-3x icon"></i>
      <div class="title">确定删除 {{ update_guide_info.name }} 解说员</div>
    </div>
    <div class="body">
      <div class="warning-tip">
        <div>请输入解说员名称</div>
        <div class="user-name">{{ update_guide_info.name }}</div>
        <div>以确认执行清空操作</div>
      </div>
      <!-- <input type="text" placeholder="请输入解说员名称" v-model="input_val" /> -->
      <IconInput
        placeholder="请输入解说员名称"
        v-model="input_val"
        width="80%"
      ></IconInput>
      <el-button class="del-btn" type="primary" @click="delUser"
        >删除解说员</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import IconInput from "@/components/input/iconInput.vue";

import { useGuideStoreForSetup } from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { deleteGuide } from "@/utils/api/guide";
import { Axios, AxiosError } from "axios";

// -------------------- P R O P S -------------------- //

// -------------------- S T O R E -------------------- //

const guide_store = useGuideStoreForSetup();
const { show_drawer, update_guide_info, guide_list } = storeToRefs(guide_store);

// ----------------- C O N S T A N T ----------------- //

const input_val = ref("");

// ----------------- F U N C T I O N ----------------- //

const delUser = async () => {
  if (input_val.value !== update_guide_info.value.name) {
    ElMessage.error("请按照提示输入解说员名称");
    return;
  }
  try {
    const res = await deleteGuide(update_guide_info.value.id);
    console.log(res);
    if (res.status === 201) {
      show_drawer.value = false;
      guide_list.value = guide_list.value.filter((item: IGuide) => {
        return item.name !== update_guide_info.value.name;
      });
      ElMessage.success("删除成功");
    } else {
      ElMessage.error("删除失败");
    }
  } catch (error: any) {
    if (error.response.data.message) {
      ElMessage.error(error.response.data.message);
    } else {
      ElMessage.error("删除失败");
    }
  }
};
</script>

<style lang="scss" scoped>
.main-content {
  margin-top: 30px;
  .header {
    width: 80%;
    display: flex;
    align-items: center;
    gap: var(--common-padding);
    margin-inline: auto;
    .icon {
      color: red;
    }
    .title {
      font-size: 20px;
      font-weight: 600;
    }
  }
  .body {
    margin-top: var(--common-padding);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    gap: 10px;
    .warning-tip {
      width: 80%;
      display: flex;
      align-items: center;
      gap: var(--common-padding);
      font-size: 14px;
      color: #666;
      .user-name {
        font-weight: 600;
        color: black;
      }
    }
    input {
      width: 80%;
      height: 40px;
      border: 1px solid #d5d5d5;
      border-radius: 4px;
      padding: var(--common-padding);
      margin-top: var(--common-padding);
    }
    .del-btn {
      margin-top: 20px;
    }
  }
}
</style>
