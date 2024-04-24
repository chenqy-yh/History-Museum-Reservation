import { apiService } from '@/utils/http';

export const queryRecordByDate = (date: string) => {
    return apiService.get<{
        record: IRecord,
    }>('/record/getRecordByDate', {
        params: {
            date: date
        }
    })
}