interface IRecord {
    date: string,
    time_cap: string,
    close: boolean,
    full: boolean,
    order_book_list: string,
    order_size_list: string,
    t_size_am: number,
    t_size_pm: number,
    orders: IOrder[],
}

interface ITimeCapItem {
    date: string,
    data: string,
    full: boolean,
    idx: number,
    cap: number,
}