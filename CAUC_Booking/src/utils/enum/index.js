export const Auth = {
  USER_TOEN: "USER_TOEN",
};

export const OrderType = new Proxy(
  {
    0: "待审核",
    1: "已通过",
    2: "未通过",
    3: "已取消",
    4: "已完成",
    5: "失约",
    6: "迟到",
  },
  {
    get: function (tar, prop) {
      return prop in tar ? tar[prop] : "未知";
    },
  }
);

export const OperateStatusEnum = {
  UNSOLVE: 0,
  SOLVE: 1,
}

export const OrderStatusEnum = {
  UNFINISH: 0,
  FINISH: 1,
}

export const OrderErrorStatusEnum = {
  NONE: 0,
  MISS: 1,
  LATE: 2,
  CANCEL: 3,
  REJECT: 4,
}

export const OperateStatusType = new Proxy({
  0: "待审核",
  1: "已审核",
}, {
  get: function (tar, prop) {
    return prop in tar ? tar[prop] : "未知";
  }
})

export const OrderStatusType = new Proxy({
  0: "未完成",
  1: "已完成",
}, {
  get: function (tar, prop) {
    return prop in tar ? tar[prop] : "未知";
  }
});

export const OrderErrorStatusType = new Proxy({
  0: "无",
  1: "失约",
  2: "迟到",
  3: "提前取消",
  4: "拒绝"
}, {
  get: function (tar, prop) {
    return prop in tar ? tar[prop] : "未知";
  }
})
