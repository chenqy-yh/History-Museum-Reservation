import axios, { AxiosResponse } from "axios"
import { apiService } from '@/utils/http';

//根据日期查询订单总数
export const getOrderCountByDate = (date: string): Promise<AxiosResponse<number>> => {
    return apiService.get<number>('/order/getOrderCountByDate', {
        params: {
            date: date
        }
    });
}

//根据createAt查询订单总数
export const getOrderCountByCreateAt = (date: string): Promise<AxiosResponse<number>> => {
    return apiService.get<number>('/order/getOrderCountByCreateAt', {
        params: {
            date: date
        }
    });
}



// 根据状态列表获取 order
export const getPageOrderByStatusList = (
    page: number,
    size: number,
    dateList: string[],
    guide_assign: number,
    operate_status_list: number[],
    order_status_list: number[],
    error_status_list: number[],

): Promise<AxiosResponse<IOrder[]>> => {
    return apiService.get<IOrder[]>('/order', {
        params: {
            p: page,
            s: size,
            guide_assign: guide_assign,
            operate_status_list: operate_status_list,
            order_status_list: order_status_list,
            error_status_list: error_status_list,
            date: dateList
        }
    });
};

// 根据状态列表获取 order 数量
export const getOrderCountByStatusList = (
    dateList: string[],
    guide_assign: number,
    operate_status_list: number[],
    order_status_list: number[],
    error_status_list: number[],

): Promise<AxiosResponse<number>> => {
    return apiService.get<number>('/order/count', {
        params: {
            guide_assign: guide_assign,
            operate_status_list: operate_status_list,
            order_status_list: order_status_list,
            error_status_list: error_status_list,
            date: dateList
        }
    });
}


// // 为订单指派引导员
// export const assignGuide = (order_id: number, guide_id: number): Promise<AxiosResponse<string>> => {
//     return apiService.get<string>('/order/assign', {
//         params: {
//             order_id: order_id,
//             guide_id: guide_id
//         }
//     });
// }

//删除为订单指派的引导员
export const deleteOrderGuidConnect = (order_id: number): Promise<AxiosResponse<string>> => {
    return apiService.get<string>('/order/deleteGuide', {
        params: {
            order_id: order_id
        }
    });
}


//根据guide_id获取订单
export const getOrderListByGuideId = (guide_id: number, order_type: 'all' | 'finish' | 'unfinish' = 'all'): Promise<AxiosResponse<{
    finish_order_list: IOrder[],
    unfinish_order_list: IOrder[]
}>> => {
    return apiService.get<{
        finish_order_list: IOrder[],
        unfinish_order_list: IOrder[]
    }>('/order/getOrderListByGuideId', {
        params: {
            guide_id: guide_id,
            order_type: order_type
        }
    });
}

//根据订单id获取引导员
export const getGuideByOrderId = (order_id: number): Promise<AxiosResponse<IOrder>> => {
    return apiService.get<IOrder>('/order/getGuideByOrderId', {
        params: {
            order_id: order_id
        }
    });
}


// 更新订单 操作 状态
export const updateOrderOperateStatus = (order_id: number, operate_status: number): Promise<AxiosResponse<string>> => {
    return apiService.post<string>('/order/update/operatestatus', {
        order_id: order_id,
        operate_status: operate_status
    });
}

// 更新订单 状态
export const updateOrderStatus = (order_id: number, order_status: number): Promise<AxiosResponse<string>> => {
    return apiService.post<string>('/order/update/orderstatus', {
        order_id: order_id,
        order_status: order_status
    });
}

// 更新订单 异常 状态
export const updateOrderErrorStatus = (order_id: number, order_error_status: number): Promise<AxiosResponse<string>> => {
    return apiService.post<string>('/order/update/errorstatus', {
        order_id: order_id,
        order_error_status: order_error_status
    });
}



