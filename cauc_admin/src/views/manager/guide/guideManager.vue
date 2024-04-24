<template>
  <div class="_outer">
    <div class="section-2">
      <div class="header">
        <div class="title">解说员管理</div>
        <div class="button-group">
          <div class="btn-box">
            <IconButton
              text="新增解说员"
              icon="ri-add-circle-line"
              :click="openAddGuideDialog"
            ></IconButton>
          </div>
          <IconButton icon="ri-loop-left-line" theme="simple"></IconButton>
          <el-divider direction="vertical" />
          <IconButton icon="ri-settings-3-line" theme="simple"></IconButton>
        </div>
      </div>
      <div class="content">
        <el-table
          :data="guide_list"
          stripe
          style="width: 100%"
          class="center-table"
          :border="true"
          :fit="true"
        >
          <el-table-column
            type="index"
            label="序号"
            fixed="left"
            :align="'center'"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            :align="'center'"
          ></el-table-column>
          <el-table-column
            prop="staff_id"
            label="工号"
            :align="'center'"
          ></el-table-column>
          <el-table-column
            prop="group"
            label="部门"
            :align="'center'"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="tel"
            label="手机号"
            :align="'center'"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="guide_time"
            label="带团次数"
            :align="'center'"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="操作"
            :align="'center'"
            width="100"
            fixed="right"
          >
            <template v-slot="{ row }">
              <div class="ops-group">
                <!-- <i
                  class="ri-eye-2-line op-icon primary"
                  @click="() => openQueryGuideUnfinishOrderDialog(row.id)"
                ></i> -->
                <i
                  class="ri-edit-box-line op-icon primary"
                  @click="() => openGuideInfoDrawer(row)"
                ></i>
                <!-- <i
                  class="ri-delete-bin-6-line op-icon primary"
                  @click="() => onDeleteGuide(row.id)"
                ></i> -->
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
      <component :is="drawer_component"></component>
      <!-- <GuideInfo></GuideInfo> -->
    </el-drawer>
    <!-- <UpdateGuideDialog></UpdateGuideDialog> -->
    <!-- query guide unfinish order -->
    <!-- <QueryUnfinishDialog></QueryUnfinishDialog> -->
  </div>
</template>

<script setup lang="ts">
import IconButton from "@/components/button/iconButton.vue";
import AddGuide from "@/views/manager/guide/components/add-guide.vue";
// import QueryUnfinishDialog from "@/views/manager/guide/components/queryUnfinishDialog.vue";
import GuideUnfinishOrder from "./components/guide-order-detail.vue.js";
import UpdateGuide from "@/views/manager/guide/components/update-guide.vue";
import GuideInfo from "@/views/manager/guide/components/guide-info.vue";

import { useGuideStoreForSetup } from "@/store";
import { deleteGuide, getGuideList } from "@/utils/api/guide";
import { storeToRefs } from "pinia";

import { getOrderListByGuideId } from "@/utils/api/order";

import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, shallowRef, ref } from "vue";

// -------------------- S T O R E -------------------- //
const guide_store = useGuideStoreForSetup();
const {
  update_guide_info,
  guide_list,
  unfinish_order_list,
  show_drawer,
  drawer_title,
  show_add_guide_dialog,
  show_updete_guide_dialog,
  show_query_guide_unfinish_order_dialog,
} = storeToRefs(guide_store);

// ----------------- C O N S T A N T ----------------- //

const drawer_component = shallowRef();

// ------------------- C I R C L E ------------------- //

onMounted(async () => {
  // 获取common用户列表
  await queryGuideList();
});

// ----------------- F U N C T I O N ----------------- //

const openAddGuideDialog = () => {
  drawer_title.value = "添加解说员信息";
  drawer_component.value = AddGuide;
  // show_add_guide_dialog.value = true;
  show_drawer.value = true;
};

const openGuideInfoDrawer = (row: IGuide) => {
  drawer_title.value = "解说员详情";
  update_guide_info.value.id = row.id!;
  update_guide_info.value.name = row.name;
  update_guide_info.value.staff_id = row.staff_id;
  row.group && (update_guide_info.value.group = row.group);
  update_guide_info.value.tel = row.tel;
  show_updete_guide_dialog.value = true;
  drawer_component.value = GuideInfo;
  show_drawer.value = true;
};

const openQueryGuideUnfinishOrderDialog = (guide_id: number) => {
  getOrderListByGuideId(guide_id, "unfinish")
    .then((res) => {
      console.log(res);
      unfinish_order_list.value = res.data.unfinish_order_list;
      show_query_guide_unfinish_order_dialog.value = true;
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error("获取未完成订单列表失败");
    });

  // show_query_guide_unfinish_order_dialog.value = true;
};

// 删除解说员
const onDeleteGuide = (id: number) => {
  ElMessageBox.confirm("点击确认删除解说员?", "确认通知", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    autofocus: true,
  })
    .then(() => {
      deleteGuide(id)
        .then(async (res) => {
          console.log(res);
          await queryGuideList();
          switch (res.status) {
            case 200:
              queryGuideList();
              ElMessage.success("删除成功");
              break;
            default:
              ElMessage.error("删除失败");
              break;
          }
        })
        .catch((err) => {
          console.log(err);
          const code = err.response.status;
          switch (code) {
            case 458:
              ElMessage.error("该解说员有未完成的订单，无法删除");
              break;
            default:
              ElMessage.error("删除失败");
              break;
          }
        });
    })
    .catch(() => {});
};

// 获取guide列表
const queryGuideList = async () => {
  try {
    guide_list.value = (await getGuideList()).data;
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped>
.unfinish-order-list-area {
  .unfinish-order-item {
    display: flex;
  }
}

.guide-block {
  display: flex;
  justify-content: center;
  .guide-form {
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
}

._outer {
  height: 100%;
  display: flex;
  flex-direction: column;

  .ops-group {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .op-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      &.primary {
        border: 1.5px solid var(--button-primary-bg-color);
        color: var(--button-primary-bg-color);
        transition: var(--common-transition);
        &:hover {
          background-color: var(--button-primary-bg-color);
          color: var(--button-primary-color);
          transition: var(--common-transition);
        }
      }
      &.warning {
        border: 1.5px solid var(--button-warning-bg-color);
        color: var(--button-warning-bg-color);
        transition: var(--common-transition);
        &:hover {
          background-color: var(--button-warning-bg-color);
          color: var(--button-warning-color);
          transition: var(--common-transition);
        }
      }
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
  }
}
</style>
