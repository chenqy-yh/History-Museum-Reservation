interface IMenuItem {
    name?: string;
    icon?: string;
    path?: string;
    link_name?: RouteRecordName;
    children?: IMenuItem[];
}