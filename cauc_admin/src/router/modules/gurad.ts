import { IPermissionRoute } from '@/typings/router'
import { get } from '@/utils/store'
import { Auth, Router as RouterEnum } from '@/utils/store/keys'
import { RouteLocationNormalized, Router } from 'vue-router'
import { setupDynamicRoutes } from '.'

class Gurad {
    constructor(
        private router: Router,
    ) { }
    public run() {
        this.router.beforeEach((to, from) => this.beforeEach(to, from))
    }
    private beforeEach(to: RouteLocationNormalized, from: RouteLocationNormalized) {
        if (to.meta.auth && !this.authToken()) {
            return 'login'
        }
        const has_route = this.router.hasRoute(to.name as string)
        if (!has_route) {
            console.log('第一次无路由 , to name', to.fullPath);
            // 从缓存中读取
            const pm_route_list_cache: IPermissionRoute[] = get<IPermissionRoute[]>(RouterEnum.DYNAMIC_ROUTE_LIST)?.data || [];
            const has_in_cache = pm_route_list_cache.some((item: IPermissionRoute) => {
                console.log('item.full_path_list', item.full_path_list);
                return item.full_path_list.includes(to.fullPath)
            }
            )
            if (has_in_cache) {
                // 有缓存
                setupDynamicRoutes(pm_route_list_cache)
                return to.fullPath
            } else {
                // 无缓存
                return {
                    name: 'NotFound',
                }
            }
        }

    }

    private authToken() {
        // 检查浏览器中是否有缓存
        const refresh_storage: ILocalData<IRefreshToken> | null = get<IRefreshToken>(Auth.REFRESH_TOKEN)
        const access_storage: ILocalData<IAccessToken> | null = get<IAccessToken>(Auth.ACCESS_TOKEN)
        if (refresh_storage && access_storage) {
            return true
        }
        return false
    }


}

export default (router: Router) => {
    new Gurad(router).run()
}