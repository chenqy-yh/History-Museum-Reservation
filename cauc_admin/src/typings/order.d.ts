interface IOrder {
    // 订单ID
    id?: int;
    // 创建时间
    createAt?: string;
    // 修改时间
    updateAt?: string;
    // 组织名称
    organize?: string;
    // 组织类型
    org_type?: number | string;
    // 预订人名称
    pm_name?: string;
    // 预订人电话
    pm_tel?: number;
    // 参观日期
    order_date?: string;
    // 参团总人数
    // size?: number;
    // 订单预订时间
    // order_time?: string;
    // 是否需要指导员
    need?: boolean;
    // 操作状态
    operate_status?: number;
    // 订单当前状态
    order_status?: number;
    // 订单异常状态
    error_status?: number;
    // 许可书
    verify_url?: string;
    // 许可书上传类型
    sub_pm_type?: string;
    // 引导员 ID
    // guide_id?: number;
    // 引导员
    // guide?: IGuide;
    orderItems?: IOrderItem[];
}


interface IOrderItem {
    id?: number;
    createdAt: string;
    updatedAt: string;
    openid: string;
    orderId: number;
    order_date: string;
    order_time: string;
    order_time_idx: number;
    size: number;
    guide_id: number;
    guide?: IGuide;
}

