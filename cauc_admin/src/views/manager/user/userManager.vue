<template>
  <div class="_outer">
    <!-- <div class="section-1">
      <div class="header">
        <div class="title">用户过滤</div>
      </div>
      <form>
        <div class="input-group">
          <div class="form-item">
            <div class="form-item-title">用户名称:</div>
            <IconInput></IconInput>
          </div>
          <div class="form-item">
            <div class="form-item-title">手机号:</div>
            <IconInput></IconInput>
          </div>
        </div>

        <div class="btn-group">
          <IconButton icon="ri-search-line" text="搜索"></IconButton>
          <IconButton
            theme="light"
            icon="ri-loop-left-line"
            text="重置"
          ></IconButton>
        </div>
      </form>
    </div> -->
    <div class="section-2">
      <div class="header">
        <div class="title">用户管理</div>
        <div class="button-group">
          <div class="btn-box">
            <IconButton
              text="新增用户"
              icon="ri-add-circle-line"
              :click="openAddUserDialog"
            ></IconButton>
          </div>
          <IconButton
            icon="ri-loop-left-line"
            theme="simple"
            @click="refreshUserList"
          ></IconButton>
          <el-divider direction="vertical" />
          <IconButton icon="ri-settings-3-line" theme="simple"></IconButton>
        </div>
      </div>
      <div class="content">
        <el-table
          :data="common_user_list"
          stripe
          style="width: 100%"
          class="center-table"
          :border="true"
          v-loading="loading"
        >
          <el-table-column
            type="index"
            label="序号"
            fixed="left"
            :align="'center'"
          ></el-table-column>
          <el-table-column
            prop="nickname"
            label="昵称"
            :align="'center'"
          ></el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            :align="'center'"
          ></el-table-column>
          <el-table-column
            prop="tel"
            label="手机号"
            :align="'center'"
          ></el-table-column>
          <el-table-column
            prop="mail"
            label="邮箱"
            :align="'center'"
          ></el-table-column>
          <el-table-column
            prop="role"
            label="角色"
            :align="'center'"
          ></el-table-column>
          <el-table-column
            prop="f_admin.nickname"
            label="授权管理员"
            :align="'center'"
          ></el-table-column>
          <el-table-column prop="sex" label="性别" :align="'center'">
            <template v-slot="{ row }">
              <div>{{ row.sex ? "女" : "男" }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" :align="'center'">
            <template v-slot="{ row }">
              <div>{{ row.status ? "禁用" : "开启" }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" :align="'center'">
            <template v-slot="{ row }">
              <div>{{ formatDateTime(row.createdAt) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="更新时间" :align="'center'">
            <template v-slot="{ row }">
              <div>{{ formatDateTime(row.updatedAt) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="120"
            :align="'center'"
          >
            <template v-slot="{ row }">
              <div class="ops-group">
                <IconButton
                  icon="ri-edit-box-line"
                  theme="simple"
                  :border="true"
                  @click="() => openUpdateUserDialog(row)"
                ></IconButton>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-drawer
      v-model="show_drawer"
      :title="drawer_title"
      :direction="'rtl'"
      size="600px"
    >
      <component :is="drawer_component" :userInfo="choose_update_user_info" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import IconButton from "@/components/button/iconButton.vue";
import IconInput from "@/components/input/iconInput.vue";
import AddUserBlock from "./components/add-user-block.vue";
import UpdateUserBlock from "./components/update-user-block.vue";

import { useUserManagerStoreForSetup } from "@/store";
import { getCommonUserList } from "@/utils/api/user";
import { formatDateTime } from "@/utils/fn";
import { storeToRefs } from "pinia";
import { onMounted, ref, shallowRef } from "vue";

// -------------------- S T O R E -------------------- //
const user_manager_store = useUserManagerStoreForSetup();
const { show_drawer, common_user_list } = storeToRefs(user_manager_store);

// ----------------- C O N S T A N T ----------------- //

// loading
const loading = ref(false);
// 右侧弹窗组件
const drawer_component = shallowRef<any>(null);
// 右侧弹窗标题
const drawer_title = ref();
// 选择更新的用户信息
const choose_update_user_info = ref<IUser>();
// ------------------- C I R C L E ------------------- //
onMounted(async () => {
  // 获取common用户列表
  await queryCommonUserList();
});

// ----------------- F U N C T I O N ----------------- //
// 打开添加用户弹窗
const openAddUserDialog = () => {
  drawer_component.value = AddUserBlock;
  drawer_title.value = "添加用户";
  show_drawer.value = true;
};

// 打开更新用户弹窗
const openUpdateUserDialog = (user: IUser) => {
  drawer_component.value = UpdateUserBlock;
  drawer_title.value = "修改用户";
  choose_update_user_info.value = user;
  show_drawer.value = true;
};

// 获取common用户列表
const queryCommonUserList = async () => {
  try {
    loading.value = true;
    const res = await getCommonUserList();
    common_user_list.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const refreshUserList = async () => {
  await queryCommonUserList();
};
</script>

<style lang="scss" scoped>
._outer {
  height: 100%;
  display: flex;
  flex-direction: column;
  .section-1 {
    margin-bottom: var(--common-padding);
    .header {
      padding-bottom: var(--common-padding);
      border-bottom: 1px solid #d5d5d5;
      .title {
        font-size: 14px;
        font-weight: 600;
      }
    }

    padding: var(--common-padding);
    background-color: var(--bg-primary-color);
    display: flex;
    flex-direction: column;
    .input-group {
      display: flex;
      flex-wrap: wrap;
    }
    .form-item {
      display: grid;
      grid-template-columns: 80px max-content;
      align-items: center;
      width: max-content;
      padding: var(--common-padding);
      padding-left: 0;

      .form-item-title {
        width: max-content;
        padding-right: var(--common-padding);
        font-weight: 600;
        color: #666;
        font-size: 14px;
        white-space: nowrap;
      }
      .form-item-input {
        width: 200px;
        height: 30px;
        //去除input的默认样式
        outline: none;
        border: none;
        border: 1.5px solid var(--input-border-color);
        border-radius: 4px;
        padding-inline: var(--common-padding);
        transition: all 0.3s ease;
        &:hover {
          border-color: #aaa;
        }
        &:focus {
          border-color: var(--input-border-focus-color);
        }
      }
    }
    .btn-group {
      width: max-content;
      margin-left: auto;
      margin-right: 30px;
      display: flex;
      gap: var(--common-padding);
      margin-top: var(--common-padding);
    }
  }
  .section-2 {
    padding: var(--common-padding);
    width: 100%;
    height: 100%;
    background-color: #fefefe;
    overflow-x: hidden;
    .header {
      display: flex;
      align-items: center;
      padding-bottom: var(--common-padding);
      border-bottom: 1px solid #d5d5d5;
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      .button-group {
        // border: 1px solid red;
        margin-left: auto;
        display: flex;
        align-items: center;
        .btn-box {
          margin-right: 10px;
        }
      }
    }
    .content {
      .ops-group {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
      }
    }
  }
}
</style>
