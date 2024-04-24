import { IPermissionRoute } from "@/typings/router"
import { apiService } from "@/utils/http"


export const getUserPersssionRoutes = () => {
return apiService.post<IPermissionRoute[]>('/router/list')
}