import { apiService } from '@/utils/http/index'


// 获取所有游客
export const getTouristList = () => {
    return apiService.get<any[]>('/tourist/getTouristList')
}

// 更新游客状态
export const updateTouristStatus = (openid: string, status: number) => {
    return apiService.post('/tourist/update/status', {
        openid,
        status
    })
}