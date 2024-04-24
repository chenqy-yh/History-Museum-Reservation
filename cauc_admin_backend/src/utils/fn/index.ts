
export const jsonObjectValid = <T>(obj: T) => {
    // 从泛型上获取键
    type keys = keyof T;
    
    const valid = Object.keys(obj).some(key => {
        
    });
}