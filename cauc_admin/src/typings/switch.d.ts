interface ISwitchItem<T> {
    value: T;
    label: string;
    type: "info" | "success" | "error" | "warning";
    checked: boolean;
}