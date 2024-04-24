import { defineStore } from "pinia";
import { ref } from "vue";
import { base_url } from "../../../utils/config/http";
import { timeFormat } from "../../../utils/fn";
import { Auth } from "../../../utils/enum";
import { get_order_list_by_openid } from "../../../utils/http/order";

export const useUserStore = defineStore("user", () => {
  const avatar = ref();
  const nickname = ref();
  const openid = ref();
  const token = ref();
  const token_expire = ref();
  const login_status = ref(false);

  //   fn
  const login = () => {
    return new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: "登陆",
        success: (res) => {
          uni.login({
            provider: "weixin",
            success: (login_res) => {
              if (login_res.errMsg === "login:ok") {
                let js_code = login_res.code;
                // 2 请求微信api 传递4个参数 appid secret js_code grant_type
                uni.request({
                  url: `${base_url}/auth/login`,
                  method: "POST",
                  timeout: 10000,
                  data: {
                    code: js_code,
                  },
                  success: (res) => {
                    avatar.value = res.data.user.avatar;
                    nickname.value = res.data.user.nickname;
                    openid.value = res.data.user.openid;
                    // get token and token-max-age from headers
                    let _token =
                      res.header["authorization"] ||
                      res.header["Authorization"];
                    let _maxAge =
                      res.header["token-max-age"] ||
                      res.header["Token-Max-Age"];
                    const now = Date.now();
                    const _token_expire = now + timeFormat(_maxAge);
                    token.value = _token;
                    token_expire.value = _token_expire;
                    uni.setStorageSync(Auth.USER_TOEN, {
                      _token,
                      _token_expire,
                      _user: res.data.user,
                    });
                    login_status.value = true;
                    resolve(res);
                  },
                  fail: (err) => {
                    reject(err);
                  },
                });
              }
            },
          });
        },
      });
    });
  };

  const logout = () => {
    avatar.value = undefined;
    nickname.value = undefined;
    token.value = undefined;
    token_expire.value = undefined;
    login_status.value = false;
    uni.removeStorageSync(Auth.USER_TOEN);
  };

  // 根据缓存数据恢复用户信息
  const restore_user_info = () => {
    // 判断缓存中是否有token
    const user_token = uni.getStorageSync(Auth.USER_TOEN);
    if (!user_token) {
      return;
    }
    // 判断token是否过期
    const _token_expire = user_token._token_expire;
    const now = new Date().getTime();
    if (now > _token_expire) {
      uni.removeStorageSync(Auth.USER_TOEN);
      return;
    }

    avatar.value = user_token._user.avatar;
    nickname.value = user_token._user.nickname;
    openid.value = user_token._user.openid;
    token.value = user_token._token;
    token_expire.value = user_token._token_expire;
    login_status.value = true;
  };

  // 根据openid获取订单列表
  const getOrdersByOpenid = () => {
    return new Promise((resolve, reject) => {
      get_order_list_by_openid(openid.value)
        .then((res) => {
          // 逆转数组
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return {
    avatar,
    nickname,
    openid,
    login_status,
    token,
    token_expire,
    login,
    logout,
    getOrdersByOpenid,
    restore_user_info,
  };
});
