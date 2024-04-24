import { IPermissionRoute, IRouteRecordRaw } from '@/typings/router';
import { unique_obj } from '@/utils/fn/arr';
import { get, set } from '@/utils/store';
import { Router } from '@/utils/store/keys';
import { Component } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { router } from '../index';


export const constantRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        meta: {
            auth: true,
            title: '首页'
        },
        component: () => import('@/views/home/home.vue'),
        redirect: '/',
        children: [
            {
                path: '/',
                name: 'Dashboard',
                meta: {
                    auth: true,
                    title: '控制台',
                    show: true,
                    icon: "ri-dashboard-fill",
                    isTop: true
                },
                component: () => import('@/views/dashboard/dashboard.vue')
            },
            {
                path: '/touristIndex',
                name: 'TouristIndex',
                meta: {
                    auth: true,
                    title: '游客',
                    show: true,
                    icon: "ri-user-3-line",
                    isTop: true
                },
                children: [
                    {
                        path: '/touristManager',
                        name: 'TouristManager',
                        meta: {
                            auth: true,
                            title: '游客管理',
                            show: true,
                        },
                        component: () => import('@/views/tourist/tourist-manager.vue')
                    }
                ],
            },
            {
                path: '/orderIndex',
                name: 'OrderIndex',
                meta: {
                    auth: true,
                    title: '订单',
                    show: true,
                    icon: "ri-bookmark-3-line",
                    isTop: true
                },
                children: [
                    {
                        path: '/order',
                        name: 'Order',
                        meta: {
                            auth: true,
                            title: '订单管理',
                            show: true,
                        },
                        component: () => import('@/views/order/order.vue')
                    },
                    {
                        path: '/orderCalendar',
                        name: 'OrderCalendar',
                        meta: {
                            auth: true,
                            title: '订单日历',
                            show: true,
                        },
                        component: () => import('@/views/order-calendar/order-calendar.vue')
                    },
                ]
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            auth: false,
            title: 'login'
        },
        component: () => import('@/views/login/login.vue')
    },

    {
        path: '/test',
        name: 'Test',
        meta: {
            auth: false,
            title: 'test'
        },
        component: () => import('@/views/test/test.vue')
    },
    {
        path: '/503',
        name: '503',
        meta: {
            auth: false,
            title: '503'
        },
        component: () => import('@/views/error/503.vue')
    },
    {
        path: '/404',
        name: 'NotFound',
        meta: {
            auth: false,
            title: '404'
        },
        component: () => import('@/views/error/404.vue')
    }

]

const component_map = new Map<string, Component>();

export const setupInitRoutes = () => {
    // 初始化 component_map
    const modules = import.meta.glob('../../views/**/*.vue');
    for (const path in modules) {
        const name = path.match(/views\/(.*)\.vue/)![1];
        component_map.set(name, modules[path]);
    }

    return constantRoutes;
}

export const setupDynamicRoutes = async (permission_route_list?: IPermissionRoute[]) => {
    console.log('permission_route_list', permission_route_list);

    // // 从缓存中读取动态路由
    // let pm_route_list_cache: IPermissionRoute[] = get<IPermissionRoute[]>(Router.DYNAMIC_ROUTE_LIST)?.data || [];

    // if (permission_route_list !== undefined) {
    //     (pm_route_list_cache = unique_obj([...pm_route_list_cache, ...permission_route_list]))
    // }

    // // 将去重后的动态路由存入缓存
    // set<IPermissionRoute[]>(Router.DYNAMIC_ROUTE_LIST, {
    //     data: pm_route_list_cache,
    //     expires: Date.now() + 1000 * 60 * 60 * 24 * 7
    // });


    // // 设置动态路由
    // pm_route_list_cache.forEach((pmroute) => {
    //     //根据pmroute的信息匹配对应的component
    //     addDynamicRoutes(pmroute);
    // })
}

export const addDynamicRoutes = (pmroute: IPermissionRoute) => {
    pmroute.route = format_dynamic_route(pmroute.route);
    router.addRoute(pmroute.p_node, pmroute.route);
}


const format_dynamic_route = (dynamic_route: IRouteRecordRaw) => {
    dynamic_route.children?.forEach((child) => {
        child = format_dynamic_route(child);
    })
    if (dynamic_route.component_path !== undefined) {
        // dynamic_route.component = async () => await defineAsyncComponent(() => import(/* @vite-ignore */`@/views${dynamic_route.component_path}.vue`));
        dynamic_route.component = component_map.get(dynamic_route.component_path)!;
    }



    return dynamic_route;
}
