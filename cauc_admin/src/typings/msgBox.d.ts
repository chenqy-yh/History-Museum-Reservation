import { ThemeEnum } from "@/utils/enum/theme.enum";

interface IRoute {
    name_cn: string,
    name: string,
    path: string
}

interface CustomStyle {
    width?: string,
    height?: string,
}


interface CustomData {
    title?: string,
    message?: string,
    cancelName?: string,
    confirmName?: string,
    theme?: ThemeEnum.Dark | ThemeEnum.Light,
    showCancel?: boolean,
    showConfirm?: boolean,
}

interface CustomFunction {
    onConfirm?: Function,
    onCancel?: Function,
}
