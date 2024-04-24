import { UseInterceptors, applyDecorators } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileTooLargeException, InvalidImageFormatException } from "../error";

export function ImgUploadInterceptors() {
    return applyDecorators(UseInterceptors(
        FileInterceptor('img', {
            fileFilter: (req, file, callback) => {
                // 限制文件大小最大为 2mb
                if (file.size > 2 * 1024 * 1024) {
                    callback(new FileTooLargeException(), false); // 拒绝上传
                }

                // 
                const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']; // 允许的图片上传类型
                if (allowedMimes.includes(file.mimetype)) {
                    callback(null, true); // 允许上传
                } else {
                    callback(new InvalidImageFormatException(), false); // 拒绝上传
                }
            },
        })
    ))
}