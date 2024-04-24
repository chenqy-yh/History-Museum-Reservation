<template>
  <div class="main-content">
    <el-menu
      :default-active="mneu_active_idx"
      class="el-menu-demo"
      mode="horizontal"
    >
      <el-menu-item index="1">公告设置</el-menu-item>
    </el-menu>
    <div class="setting-room">
      <el-form label-width="80px" @submit.native.prevent>
        <el-form-item label="添加公告">
          <div class="notice-list">
            <el-input
              v-for="(item, idx) in notice_list_copy"
              v-model="item.title"
              :readonly="idx <= notice_list_copy.length - 1"
            >
              <template #append>
                <el-select
                  v-model="item.type"
                  placeholder="type"
                  style="width: 100px"
                >
                  <el-option
                    :label="type_item"
                    :value="type_item"
                    v-for="(type_item, idx) in NoticeTypeList"
                    :key="idx"
                  />
                </el-select>
              </template>

              <template #suffix>
                <div class="btn-group">
                  <el-button
                    type="danger"
                    circle
                    size="small"
                    @click="() => delNotice(idx)"
                  >
                    <template #icon>
                      <i class="ri-close-line ri-lg"></i>
                    </template>
                  </el-button>
                </div>
              </template>
            </el-input>
            <el-input placeholder="新增公告" v-model="add_notice_content">
              <template #append>
                <el-select
                  v-model="add_notice_type"
                  placeholder="type"
                  style="width: 100px"
                >
                  <el-option
                    :label="type_item"
                    :value="type_item"
                    v-for="(type_item, idx) in NoticeTypeList"
                    :key="idx"
                  />
                </el-select>
              </template>
              <template #suffix>
                <div class="btn-group">
                  <el-button
                    type="primary"
                    circle
                    size="small"
                    @click="addNotice"
                    @keyup.enter.native="addNotice"
                  >
                    <template #icon>
                      <i class="ri-add-line ri-lg"></i>
                    </template>
                  </el-button>
                </div>
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveNotice">保存</el-button>
          <el-button @click="resetNotice">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useNoticeManagerStoreForSetup } from "@/store";
import { storeToRefs } from "pinia";
import { cloneDeep } from "lodash";
import { ElMessage } from "element-plus";
import { saveNoticeList, getNoticeList } from "@/utils/api/notice";
import { NoticeTypeList } from "@/utils/enum/notice.enum";

// -------------------- S T O R E -------------------- //
const noticeManagerStore = useNoticeManagerStoreForSetup();
const { notice_list } = storeToRefs(noticeManagerStore);

// ----------------- C O N S T A N T ----------------- //
const mneu_active_idx = ref("1");
const add_notice_content = ref("");
const add_notice_type = ref("");
const notice_list_copy = ref<IMsg[]>([]);

// ------------------- C I R C L E ------------------- //
onMounted(async () => {
  await init_notice_list();
});

// ----------------- F U N C T I O N ----------------- //

const init_notice_list = async () => {
  const res = await getNoticeList();
  if (res.status !== 200) {
    ElMessage.error("获取公告列表失败");
    return;
  }
  notice_list_copy.value = [...res.data];
};

const delNotice = (idx: number) => {
  notice_list_copy.value.splice(idx, 1);
};

const addNotice = () => {
  // check
  if (!add_notice_content.value) {
    ElMessage.error("请输入公告内容");
    return;
  }

  notice_list_copy.value.push({
    title: add_notice_content.value,
    delay: 5000,
    type: (add_notice_type.value as unknown as NoticeType) || NoticeTypeList[0],
  });
  add_notice_content.value = "";
};

const saveNotice = async () => {
  if(add_notice_content.value){
    ElMessage.warning("您还有未保存的公告，请先保存");
    return;
  }
  const res = await saveNoticeList(
    notice_list_copy.value.slice(0, notice_list_copy.value.length)
  );
  if (res.status !== 201) {
    ElMessage.error("保存失败");
    return;
  }
  notice_list.value = [...cloneDeep(notice_list_copy.value)];
  ElMessage.success("保存成功");
};

const resetNotice = () => {
  ElMessage.error("重置功能还未实现");
};
</script>

<style lang="scss" scoped>
.main-content {
  background: #fefefe;
  height: 100%;
  padding: var(--common-padding);
  .setting-room {
    margin-top: var(--large-gap);
    width: 500px;
    border-radius: var(--common-radius);
    .notice-list {
      display: grid;
      gap: var(--common-padding);
      width: 100%;
      .btn-group {
        // border: 1px solid red;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
