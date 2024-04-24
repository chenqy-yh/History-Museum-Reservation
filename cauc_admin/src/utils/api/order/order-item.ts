import { apiService } from '@/utils/http'


// 分配解说员
export const assignGuide = (order_item_id: number, guide_id: number) => {
    return apiService.post('/order-item/assign', {
        order_item_id: order_item_id,
        guide_id: guide_id
    })
}


// 删除解说员
export const removeGuide = (order_item_id: number) => {
    return apiService.post('/order-item/remove', {
        order_item_id: order_item_id
    })
}

// 获取订单详情 根据guide_id  type
export const getOrderItemListByGuideId = (guide_id: number, type: number) => {
    return apiService.get<IOrderItem[]>('/order-item/list', {
        params: {
            guide_id: guide_id,
            type: type
        }
    })
}
