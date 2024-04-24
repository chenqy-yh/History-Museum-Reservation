import { apiService } from '@/utils/http/index'

// 输出excel by day
export const printExcelByDay = (day_list: string[]) => {
    return apiService.get<IOrder[]>('/order/printExcel/day', {
        params: {
            day_list: day_list
        }
    })
}


// 输出excel by month
export const printExcelByMonth = (month_list: string[]) => {
    return apiService.get<IOrder[]>('/order/printExcel/month', {
        params: {
            month_list: month_list
        }
    })
}

// 输出excel by year
export const printExcelByYear = (year_list: string[]) => {
    return apiService.get<IOrder[]>('/order/printExcel/year', {
        params: {
            year_list: year_list
        }
    })
}