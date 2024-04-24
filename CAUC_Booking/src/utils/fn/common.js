import { Auth } from "../enum";

// 跳转
export const linkTo = (url, isTabbar, auth = false) => {
  if (auth) {
    // 判断是否授权
    if (!uni.getStorageSync(Auth.USER_TOEN)) {
      uni.showToast({
        title: "请先登陆",
        icon: "none",
      });
      return;
    }
  }
  if (isTabbar) {
    uni.switchTab({
      url,
    });
    return;
  } else {
    uni.navigateTo({
      url,
    });
  }
};

// 获得模糊图片
export const getBlurryImg = (url) => {
  return url + `?imageMogr2/thumbnail/!100p/quality/30`;
};

// 节流函数 用于防止用户频繁点击 重复点击 提示剩余时间
export const throttle = (fn, gapTime) => {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500;
  }
  let _lastTime = null;
  // 返回新的函数
  return function () {
    let _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments); //将this和参数传给原函数
      _lastTime = _nowTime;
    } else {
      // 重复点击提示剩余时间
      uni.showToast({
        title: `请${Math.ceil(
          (gapTime - (_nowTime - _lastTime)) / 1000
        )}秒后再试`,
        icon: "none",
      });
    }
  };
};

export const redirectTo = (url, params) => {
  return new Promise((resolve, reject) => {
    // 将对象params 转换成k1=v1&k2=v2的形式
    let paramsStr = "";
    if (params) {
      paramsStr = Object.keys(params).reduce((acc, cur) => {
        return (acc += `${cur}=${params[cur]}&`);
      }, "?");
      paramsStr = paramsStr.slice(0, -1);
    }
    uni.navigateTo({
      url: url + paramsStr,
      complete: (res) => {
        resolve(res);
      },
    });
  });
};
