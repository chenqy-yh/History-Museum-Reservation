export enum HttpCode {
    // 用户非法操作
    InValideUserAction = 450,
    // 非法图片格式
    InvalidImageFormat = 451,
    // 非法PDF格式
    InvalidPDFFormat = 452,
    // 文件大小超过限制
    FileTooLarge = 453,
    // 当日不开放
    RecordClose = 454,
    //身份验证失败 
    Validation = 455,
    // 文件上传异常
    FileUpload = 456,
    // 订单创建失败
    OrderCreate = 457,
    // 订单不存在
    OrderNotExist = 458,

}