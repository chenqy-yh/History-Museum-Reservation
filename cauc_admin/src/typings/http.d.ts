interface IResponseData<T> {
    code: number
    message: string
    data: T
}

interface ILoginRequestData {
    input_username: string
    input_password: string
    verfiyCode: string
}

interface ILoginResponseData {
    username: string
    token: string
    maxAge: string
}

interface IUserStoreInfo {
    username: string
    token: string
}