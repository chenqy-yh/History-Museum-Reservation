<template>
  <el-table
    :data="tourist_list"
    stripe
    class="center-table"
    :border="true"
    empty-text="空"
  >
    <el-table-column type="index" label="序号" fixed="left" :align="'center'">
      <template v-slot="{ row }">
        <span class="table-row">{{ row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column label="昵称" :align="'center'">
      <template v-slot="{ row }">
        <div>
          {{ row.nickname }}
        </div>
      </template>
    </el-table-column>

    <el-table-column label="微信开放ID" :align="'center'">
      <template v-slot="{ row }">
        <div>
          {{ row.openid }}
        </div>
      </template>
    </el-table-column>

    <el-table-column label="用户状态" :align="'center'">
      <template v-slot="{ row }">
        <div>
          <el-switch
            :before-change="beforeChangeTouristStauts"
            v-model="row.status"
            :active-value="0"
            :inactive-value="1"
            active-text="正常"
            inactive-text="封禁"
            @change="() => changeTouristStatus(row)"
          />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { useTouristStoreForSetup } from "@/store";
import { getTouristList, updateTouristStatus } from "@/utils/api/tourist";
import { ElMessage, ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

// -------------------- S T O R E -------------------- //

const touristStore = useTouristStoreForSetup();
const { tourist_list, show_drawer } = storeToRefs(touristStore);

// ------------------- C I R C L E ------------------- //

onMounted(() => {
  initTouristList();
});

// ----------------- F U N C T I O N ----------------- //

const openTouristDrawer = () => {
  show_drawer.value = true;
};

const beforeChangeTouristStauts = async () => {
  return ElMessageBox.confirm("确定要修改游客状态吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const initTouristList = async () => {
  const res = await getTouristList();
  if (res.status === 200) {
    tourist_list.value = res.data;
    console.log("tourist_list:", tourist_list.value);
  } else {
    ElMessage.error("获取游客列表失败");
  }
};

const changeTouristStatus = async (tourist: ITourist) => {
  await updateTouristStatus(tourist.openid!, +tourist.status!)
    .then((res) => {
      if (res.status === 201) {
        ElMessage.success("修改游客状态成功");
      } else {
        ElMessage.error("修改游客状态失败");
      }
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error("修改游客状态失败");
    });
};
</script>

<style lang="scss" scoped></style>
