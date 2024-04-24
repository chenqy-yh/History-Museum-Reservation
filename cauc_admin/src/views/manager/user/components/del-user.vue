<template>
  <div class="main-content">
    <div class="header">
      <i class="ri-error-warning-line ri-3x icon"></i>
      <div class="title">确定删除 xxxx 用户</div>
    </div>
    <div class="body">
      <div class="warning-tip">
        <div>请输入用户名称</div>
        <div class="user-name">{{ userInfo.username }}</div>
        <div>以确认执行清空操作</div>
      </div>
      <input type="text" placeholder="请输入用户名称" v-model="input_val" />
      <el-button class="del-btn" type="primary" @click="delUser"
        >删除用户</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { PropType, ref } from "vue";
import { deleteUser } from "@/utils/api/user";
import { HttpCode } from "@/utils/config";
import { useUserManagerStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";

// -------------------- P R O P S -------------------- //
const props = defineProps({
  userInfo: {
    type: Object as PropType<IUser>,
    required: true,
  },
});

// -------------------- S T O R E -------------------- //

const userManagerStore = useUserManagerStoreForSetup();
const { show_drawer, common_user_list } = storeToRefs(userManagerStore);

// ----------------- C O N S T A N T ----------------- //

const input_val = ref("");

// ----------------- F U N C T I O N ----------------- //

const delUser = async () => {
  if (input_val.value !== props.userInfo.username) {
    console.log(input_val.value, props.userInfo.username);
    ElMessage.error("请按照提示输入用户名");
    return;
  }
  const res = await deleteUser(props.userInfo.username);
  console.log(res);
  if (res.status === 201) {
    show_drawer.value = false;
    common_user_list.value = common_user_list.value.filter((item: IUser) => {
      return item.username !== props.userInfo.username;
    });
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
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
      margin-top: 30px;
    }
  }
}
</style>
