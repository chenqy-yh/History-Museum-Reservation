import { OrderStatusType } from "../enum/order.enum";



// 检查订单是否完成
export const checkOrderFinish = (order: IOrder) => {
    return order.order_status === OrderStatusType.FINISH;
}

// 检查订单是否安排解说员
export const checkOrderAssignGuide = (order: IOrder) => {
    return order.orderItems?.some(item => {
        return item.guide !== null
    })
}