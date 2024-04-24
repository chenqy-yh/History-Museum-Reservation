import _ from 'lodash'

//对象数组数组去重
export const unique_obj = <T>(arr: T[]) => {
    return _.uniqWith(arr, _.isEqual);
}

// 基本类型数组去重
const unique_base = (arr: (string | number | boolean | symbol)[]) => {
    return [...new Set(arr)];
}