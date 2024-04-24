import { Auth } from "../enum";
import { base_url } from "../config/http";
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
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 获取订单列表
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

// 认证书上传 img
export const upload_auth_img = () => {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["camera"], //这要注意，camera掉拍照，album是打开手机相册
      extension: ["jpg", "png", "webp"],
      success: (chooseImageRes) => {
        uni.uploadFile({
          url: base_url + "/upload/pmimg",
          filePath: chooseImageRes.tempFilePaths[0],
          name: "img",
          header: {
            authorization: uni.getStorageSync(Auth.USER_TOEN)._token,
          },
          formData: {
            token: "test_token",
          },
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            reject(err);
          },
        });
      },
    });
  });
};

//认证书上传 pdf
export const upload_auth_pdf = () => {
  return new Promise((resolve, reject) => {
    wx.chooseMessageFile({
      count: 1,
      type: "file",
      // 控制上传大小
      success(res) {
        // 输出文件大小
        uni.uploadFile({
          url: base_url + "/upload/pmpdf",
          filePath: res.tempFiles[0].path,
          fileType: "pdf",
          name: "pdf",
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
      },
    });
  });
};

// 取消订单
export const cancel_order = (order_id) => {
  return new Promise((resolve, reject) => {
    uni
      .request({
        url: base_url + "/order/cancelOrder",
        method: "POST",
        data: {
          order_id: order_id,
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
