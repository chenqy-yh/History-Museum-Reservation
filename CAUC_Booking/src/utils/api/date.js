import { base_url } from "../config/http";
import { Auth } from "../enum";
const sub_url = "/date";

// 根据月份获取当月的freeday
export function getFreeDayByMonth(months, cb) {
  const ms = months.map((num) => num.toString()).join(",");
  const full_url = base_url + sub_url + "/getfreeday?ms=" + ms;
  uni.request({
    url: full_url,
    method: "GET",
    header: {
      authorization: uni.getStorageSync(Auth.USER_TOEN)._token,
    },
    success: (res) => {
      cb(res);
    },
    fail: (err) => {
      console.log(err);
    },
  });
}

export const getFreeDayByMonth_v2 = (ymList) => {
  return new Promise((resolve, reject) => {
    const yms = ymList.map((num) => num.toString()).join(",");
    const full_url = base_url + "/record/daylist?yms=" + yms;
    uni.request({
      url: full_url,
      method: "GET",
      header: {
        authorization: uni.getStorageSync(Auth.USER_TOEN)._token,
      },
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const getDayCapacity = (date) => {
  return new Promise((resolve, reject) => {
    const full_url = base_url + "/record/daycap?date=" + date;
    uni.request({
      url: full_url,
      method: "GET",
      header: {
        authorization: uni.getStorageSync(Auth.USER_TOEN)._token,
      },
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
