// 规格化 将2023-10-5 规划为 2023-10-05
export const normalizeDate = (date) => {
    const date_arr = date.split('-');
    return date_arr.map(it => it.length === 1 ? '0' + it : it).join('-');
}

//获得格式化时间
export function convertToChineseTime(time: Date, suf: boolean = true): string {
    // 获取年、月、日、小时和分钟部分
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const day = String(time.getDate()).padStart(2, '0');
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    // 构建最终的格式化日期时间字符串
    return suf ? `${year}-${month}-${day} ${hours}:${minutes}` : `${year}-${month}-${day}`;

}