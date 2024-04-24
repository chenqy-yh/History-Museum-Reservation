declare module "*.vue" {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}


declare module 'element-plus/dist/locale/zh-cn.mjs';


interface Item<T> {
    label: string;
    value: T;
}

interface IRadio<T> {
    label: string;
    value: T
}

type NoticeType = "info" | "success" | "warning" | "error";

interface IMsg {
    title: string;
    delay: number;
    type: NoticeType;
}