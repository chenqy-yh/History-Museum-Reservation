import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommonStore = defineStore("common", () => {
  const loading = ref(false);
  const show_custom_toast = ref(false);
  const toast_text = ref();
  const toast_duration = ref();
  const toast_type = ref(); //success error
  return {
    loading,
    show_custom_toast,
    toast_text,
    toast_type,
    toast_duration,
  };
});
