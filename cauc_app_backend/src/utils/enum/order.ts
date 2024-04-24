// 操作状态
export enum OperateStatusType {
    // 待解决
    UNSOLVE = 0,
    // 已受理
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


export const enum PermissonType {
    IMG = 'IMG',
    PDF = 'PDF'
}

export const enum OrgType {
    IN = 0,
    OUT = 1
}

export const enum RecordBookType {
    UNBOOK = '0',
    BOOK = '1',
}