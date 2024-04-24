import { getLunar } from "chinese-lunar-calendar";

// 根据时间 09:30 输出上午 或者下午
export const getAmPm = (time) => {
  const hour = time.split(":")[0];
  return hour < 12 ? "上午" : "下午";
};

// 检查时间是否过时
export const checkTimeout = (time) => {
  const now = new Date();
  const target = new Date(time);
  return now.getTime() > target.getTime();
};

// h -> 1000*3600 m -> 1000*60 s -> 1000
export const timeFormat = (time) => {
  if (time.includes("h")) {
    return parseInt(time) * 3600 * 1000;
  }
  if (time.includes("m")) {
    return parseInt(time) * 60 * 1000;
  }
  if (time.includes("s")) {
    return parseInt(time) * 1000;
  }
  return 0;
};

// 根据时间 今天 明天 后天 星期几
export const createNoteForDateString = (dateString) => {
  const inputDate = new Date(dateString);
  const nowDate = new Date();
  const tomorrow = new Date(nowDate);
  tomorrow.setDate(nowDate.getDate() + 1);
  const dayAfterTomorrow = new Date(nowDate);
  dayAfterTomorrow.setDate(nowDate.getDate() + 2);

  return inputDate.getDate() === nowDate.getDate() &&
    inputDate.getMonth() === nowDate.getMonth()
    ? "今天"
    : inputDate.getDate() === tomorrow.getDate() &&
      inputDate.getMonth() === tomorrow.getMonth()
    ? "明天"
    : inputDate.getDate() === dayAfterTomorrow.getDate() &&
      inputDate.getMonth() === dayAfterTomorrow.getMonth()
    ? "后天"
    : `星期${
        ["日", "一", "二", "三", "四", "五", "六"][(inputDate.getDay() + 6) % 7]
      }`;
};

//2023-10-06T16:00:00.000Z -> 2023-10-06 16:00 注意上午下午
export const formatTime_YYYYMMDD_HHMM = (time) => {
  // 创建一个 Date 对象，将传入的时间字符串解析为日期对象
  const date = new Date(time);

  // 获取年、月、日、小时和分钟部分
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并且保证两位数格式
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // 构建最终的格式化日期时间字符串
  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedTime;
};

export const timeToFrame_keepPre = (time) => {
  const time_list = time.split(" ");
  const pre = time_list[0];
  return pre + " [ " + timeToFrame(time) + " ]";
};

// 把2023-10-19 8:30 这种时间 转换成  8:30 - 9:00
export const timeToFrame = (time) => {
  try {
    const hmTime = time.split(" ")[1];
    const [hour, minute] = hmTime.split(":").map(Number);
    const time_stamp = (hour * 60 + minute + 30) % (24 * 60);
    const _hour = Math.floor(time_stamp / 60);
    const _minute = time_stamp % 60;
    // 输出不足2位的补0
    return `${hour}:${format_num(minute)} - ${_hour}:${format_num(_minute)}`;
  } catch (error) {
    console.log("time_to_frame", time);
    console.log(error);
  }
};

// 2023-10-27T00:30:00.000Z -> 8:30 - 9:00
export const timeToFrameForDateStr = (time) => {
  return timeToFrame(formatTime_YYYYMMDD_HHMM(time));
};

const format_num = (num) => num.toString().padStart(2, "0");

// 判断是否超时 提前三天
export const checkTimeoutForThreeDays = (date) =>
  new Date(date) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

export const newYearToOldYear = (y, mouth, day) => {
  const str = getLunar(y, mouth, day);
  // 返回str最后两个字符
  return str.dateStr.slice(-2);
};
