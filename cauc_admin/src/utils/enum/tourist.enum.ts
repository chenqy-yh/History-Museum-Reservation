export enum TouristStatusType {
    NORMAL = 0,
    // 封禁
    BAN = 1,
}

export const touristStatusMap = new Proxy<{ [key: string]: string }>({
    '0': '正常',
    '1': '封禁',
}, {
    get(target, key: string) {
        return target[key] || '未知'
    }
})