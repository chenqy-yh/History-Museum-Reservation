// 操作状态
export const enum OperateStatusType {
    // 待解决
    UNSOLVE = 0,
    // 已接受
    SOLVE = 1,
}

// 订单状态
export const enum OrderStatusType {
    // 未完成
    UNFINISH = 0,
    // 已完成
    FINISH = 1,
}

// 异常描述状态
export const enum OrderErrorStatusType {
    // 无异常
    NONE = 0,
    // 失约
    MISS = 1,
    // 迟到
    LATE = 2,
    // 提前取消
    CANCEL = 3,
    // 拒绝
    REJECT = 4,
}

export const All_OPERATE_STATUS_TYPE = [OperateStatusType.UNSOLVE, OperateStatusType.SOLVE];

export const All_ORDER_STATUS_TYPE = [OrderStatusType.UNFINISH, OrderStatusType.FINISH];

export const All_ORDER_ERROR_STATUS_TYPE = [OrderErrorStatusType.NONE, OrderErrorStatusType.MISS, OrderErrorStatusType.LATE, OrderErrorStatusType.CANCEL,OrderErrorStatusType.REJECT];
