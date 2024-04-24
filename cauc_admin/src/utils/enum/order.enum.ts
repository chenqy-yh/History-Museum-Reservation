// 操作状态
export const enum OperateStatusType {
    // 待解决
    UNSOLVE = 0,
    // 已审核
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

// map idx to desc

export const operateStatusMap = new Proxy<{ [key: string]: string }>({
    '0': '待审核',
    '1': '已审核',
}, {
    get(target, key) {
        // 判断key是否是整数
        return key in target ? target[key.toString()] : '未知'
    }
});

export const orderStatusMap = new Proxy<{ [key: string]: string }>({
    '0': '未完成',
    '1': '已完成',
}, {
    get(target, key) {
        // 判断key是否是整数
        return key in target ? target[key.toString()] : '未知'
    }
})


export const orderErrorStatusMap = new Proxy<{ [key: string]: string }>({
    '0': '无',
    '1': '失约',
    '2': '迟到',
    '3': '提前取消',
    '4': '拒绝',
}, {
    get(target, key) {
        // 判断key是否是整数
        return key in target ? target[key.toString()] : '未知'
    }
})


// map idx to enum

export const ALL_ORDER_ERROR_STATUS = new Proxy<{ [key: string]: OrderErrorStatusType }>({
    '0': OrderErrorStatusType.NONE,
    '1': OrderErrorStatusType.MISS,
    '2': OrderErrorStatusType.LATE,
    '3': OrderErrorStatusType.CANCEL,
    '4': OrderErrorStatusType.REJECT,
}, {
    get(target, key) {
        // 判断key是否是整数
        return key in target ? target[key.toString()] : OrderErrorStatusType.NONE
    }
})

export const ALL_OPERATE_STATUS = new Proxy<{ [key: string]: OperateStatusType }>({
    '0': OperateStatusType.UNSOLVE,
    '1': OperateStatusType.SOLVE,
}, {
    get(target, key) {
        // 判断key是否是整数
        return key in target ? target[key.toString()] : OperateStatusType.UNSOLVE
    }
})

export const ALL_ORDER_STATUS = new Proxy<{ [key: string]: OrderStatusType }>({
    '0': OrderStatusType.UNFINISH,
    '1': OrderStatusType.FINISH,
}, {
    get(target, key) {
        // 判断key是否是整数
        return key in target ? target[key.toString()] : OrderStatusType.UNFINISH
    }
})