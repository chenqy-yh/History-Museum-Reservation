import { apiService } from '@/utils/http/index'

export const pingServer = () => {
    return apiService.get('/ping')
}