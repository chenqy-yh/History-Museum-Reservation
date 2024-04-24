import 'vue-router'
import { RouteRecordName, RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        auth?: boolean;
        title?: string;
        show?: boolean;
        icon?: string;
        isTop?: boolean;
    }
}

interface IHistoryLink {
    title: string;
    to: RouteRecordName;
}

interface IPermissionRoute {
    p_node: string;
    full_path_list: string[];
    route: IRouteRecordRaw;
}

interface ttt {
    name: string;
}

// type继承
declare type IRouteRecordRaw = RouteRecordRaw & {
    component_path?: string;
}