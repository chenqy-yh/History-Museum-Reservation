import { useCommonStore } from "../../store/modules/common/common";
import { storeToRefs } from "pinia";

const CToast = () => {
  const { show_custom_toast, toast_duration, toast_text, toast_type } =
    storeToRefs(useCommonStore());
  const play = () => {
    show_custom_toast.value = true;
    setTimeout(() => {
      show_custom_toast.value = false;
    }, toast_duration.value);
  };

  const checkInput = (text, duration) => {
    if (text == undefined || text == null || text == "") {
      throw new Error("text is required");
    }
    if (duration == undefined || duration == null || duration == "") {
      throw new Error("duration is required");
    }
  };
  return {
    success: (text, duration = 3000) => {
      checkInput(text, duration);
      text && (toast_text.value = text);
      toast_type.value = "success";
      duration && (toast_duration.value = duration);
      play();
    },
    error: (text, duration = 3000) => {
      checkInput(text, duration);
      text && (toast_text.value = text);
      toast_type.value = "error";
      duration && (toast_duration.value = duration);
      play();
    },
  };
};

export default CToast();
