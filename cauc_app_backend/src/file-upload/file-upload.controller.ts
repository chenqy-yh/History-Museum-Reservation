import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import * as os from 'os';
import { join } from 'path';
import { fromPath } from 'pdf2pic';
import { Auth, ImgUploadInterceptors, PdfUploadInterceptors } from '../decorator';
import { FileUploadService } from './file-upload.service';



@Controller('upload')
export class FileUploadController {

    constructor(
        private readonly fileUploadService: FileUploadService
    ) { }

    @Post('pmimg')
    @ImgUploadInterceptors()
    @Auth()
    async uploadPermissionImg(@UploadedFile() file, @Body('token') token) {
        return this.fileUploadService.uploadPermissionImg(file, token);
    }

    @Post('pmpdf')
    @PdfUploadInterceptors()
    @Auth()
    async uploadPermissionPdf(@UploadedFile() file) {
        if (os.platform() === 'linux') {
            return this.fileUploadService.uploadPermissionPdfForLinux(file);
        } else if (os.platform() === 'win32' || os.platform() === 'darwin') {
            // return this.fileUploadService.uploadPermissionPdfForWIN(file);
            throw new Error('该部署环境不支持pdf转图片');
        } else {
            throw new Error('该部署环境不支持pdf转图片');
        }
    }

}
