const userLoginMap = new Map<string, string>();

export const setUserLoginMap = (openId: string, sessionKey: string) => {
    userLoginMap.set(openId, sessionKey)
}

export const hasUser = (openId) => {
    return userLoginMap.get(openId) !== undefined
}

export const getSessionKey = (openId) => {
    return userLoginMap.get(openId)
}

export const deleteUser = (openId) => {
    userLoginMap.delete(openId)
}