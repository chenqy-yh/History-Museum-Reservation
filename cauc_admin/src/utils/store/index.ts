export const set = <T>(key: string, value: ILocalData<T>) => {
    localStorage.setItem(key, JSON.stringify(value));
}

export const get = <T>(key: string) => {
    const value = localStorage.getItem(key);
    if (value) {
        if (JSON.parse(value).expires < Date.now()) {
            remove(key);
            return null;
        }
        return JSON.parse(value) as ILocalData<T>;
    }

    return null;
}

export const remove = (key: string) => {
    localStorage.removeItem(key);
}