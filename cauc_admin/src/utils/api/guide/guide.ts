import { apiService } from "@/utils/http";

// 获取所有的guide
export const getGuideList = () => {
    return apiService.get<IGuide[]>('/guide/list')
}


// only super admin can use this api

// 获取所有的guide
export const createGuide = (guide: any) => {
    return apiService.post('/guide/add', guide)
}

// 删除guide
export const deleteGuide = (guide_id: number) => {
    return apiService.post(`/guide/delete`, {
        guide_id
    })
}

// 更新guide
export const updateGuide = (guide: any) => {
    return apiService.post('/guide/update', guide)
}
