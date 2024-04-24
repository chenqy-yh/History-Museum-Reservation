import { UseInterceptors, applyDecorators } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileTooLargeException, InvalidPDFFormatException } from "../error";

export function PdfUploadInterceptors() {
    return applyDecorators(UseInterceptors(
        FileInterceptor('pdf', {
            fileFilter: (_, file, callback) => {
                // 限制文件大小最大为 2mb
                if (file.size > 2 * 1024 * 1024) {
                    callback(new FileTooLargeException(), false); // 拒绝上传
                }
                const allowedMimes = ['application/pdf']; // 允许的PDF上传类型
                if (allowedMimes.includes(file.mimetype)) {
                    callback(null, true); // 允许上传
                } else {
                    callback(new InvalidPDFFormatException(), false); // 拒绝上传
                }
            },
        }),
    ))
}