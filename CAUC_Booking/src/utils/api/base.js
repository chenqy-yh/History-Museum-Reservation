import { base_url } from "../config/http";
import { Auth } from "../enum";

export const get = (url, data) => {
  return new Promise((resolve, reject) => {
    uni
      .request({
        url: `${base_url}${url}`,
        method: "GET",
        data: data,
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

export const post = (url, data, config) => {
  return new Promise((resolve, reject) => {
    uni
      .request({
        url: `${base_url}${url}`,
        method: "POST",
        data: data,
        header: {
          "content-type": "application/json",
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
