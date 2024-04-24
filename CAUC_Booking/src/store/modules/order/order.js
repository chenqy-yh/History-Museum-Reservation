import { defineStore } from "pinia";
import { ref } from "vue";

export const useOrderStore = defineStore("order", () => {
  // 授权书图片路径
  const pm_type = ref(0);
  const img_url = ref();
  const pdf_url = ref();
  // 预订人姓名
  const permission_name = ref();
  // 预订人电话
  const permission_tel = ref();
  // 组织名称
  const college = ref();
  // 组织类型
  const org_type = ref();
  // 场次人数
  const size_list = ref([]);
  // 是否需要讲解员
  const need = ref(false);
  // 是否还有讲解员
  const has_guide = ref(false);
  // yyyy-mm-dd
  const choose_date = ref();
  //yyyy-mm-dd hh:mm
  // const choose_time = ref();
  // 0-11
  // const choose_time_idx = ref();

  //yyyy-mm-dd hh:mm list
  const choose_time_list = ref([]);
  // 0-11 []
  const choose_time_idx_list = ref([]);

  //order_detail
  const choose_order_detail = ref({});

  //fn

  const reset_order_data = () => {
    pm_type.value = 0;
    img_url.value = undefined;
    pdf_url.value = undefined;
    permission_name.value = undefined;
    permission_tel.value = undefined;
    college.value = undefined;
    need.value = false;
    has_guide.value = false;
    choose_date.value = undefined;
    size_list.value = [];
    choose_time_list.value = [];
    choose_time_idx_list.value = [];
    org_type.value = undefined;
  };

  return {
    pm_type,
    img_url,
    pdf_url,
    permission_name,
    permission_tel,
    size_list,
    need,
    choose_date,
    choose_time_list,
    choose_time_idx_list,
    college,
    org_type,
    has_guide,
    choose_order_detail,
    reset_order_data,
  };
});
