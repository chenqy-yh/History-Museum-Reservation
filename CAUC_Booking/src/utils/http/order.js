import { base_url } from "../config/http";
import { Auth } from "../enum";
// 提交订单申请
export const sub_order = (data) => {
  return new Promise((resolve, reject) => {
    uni
      .request({
        url: base_url + "/order/createOrder",
        method: "POST",
        data: data,
        header: {
          "content-type": "application/json",
          authorization: uni.getStorageSync(Auth.USER_TOEN)._token,
        },
      })
      .then((res) => {
        console.log("submit_order:", res);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const get_order_list_by_openid = (openid) => {
  return new Promise((resolve, reject) => {
    uni
      .request({
        url: base_url + "/order/queryorder",
        method: "GET",
        data: {
          openid,
        },
        header: {
          authorization: uni.getStorageSync(Auth.USER_TOEN)._token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
