interface ITourist {
    id?: number,
    nickname?: string,
    createdAt?: Date,
    updatedAt?: Date,
    status?: number,
    openid?: string,
    orders?: IOrder[]
}