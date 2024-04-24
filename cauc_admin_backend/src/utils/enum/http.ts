export enum HttpCode {
    // accessToken过期
    AccessTokenTimeout = 402,
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
    // 查询订单总数失败
    OrderCount = 457,
    //指导员删除异常
    GuideDelete = 458,
    // Admin 创建失败
    AdminCreate = 459,
}