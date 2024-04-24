import { apiService } from '@/utils/http/index'


/**
 * 保存设置通知列表
 * 
 * @param notice_list 通知列表
 * 
*/
export const saveNoticeList = (notice_list: IMsg[]) => {
    return apiService.post<string>('/notice/save', { notice_list })
}

/**
 * 获取通知列表
 * 
 * @returns 通知列表
 * 
*/
export const getNoticeList = () => {
    return apiService.get<IMsg[]>('/notice/list')
}

