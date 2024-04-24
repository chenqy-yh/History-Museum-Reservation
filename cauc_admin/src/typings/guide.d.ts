interface IGuide {
    id?: number
    createAt?: Date
    updateAt?: Date
    staff_id: string
    name: string
    group?: string
    tel: string
    guide_time?: number
    order_items?: IOrderItem[]
}