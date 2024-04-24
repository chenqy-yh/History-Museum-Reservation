import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EmptyFileException, FileTooLargeException, FileUploadException, InvalidImageFormatException, InvalidPDFFormatException } from '../../error';
// const COS = require('cos-nodejs-sdk-v5');
import * as COS from 'cos-nodejs-sdk-v5';

@Controller('upload')
export class FileUploadController {
    // COS
    private cos;
    // BUCKETNAME
    private bucket_img = '';
    private bucket_pdf = '';
    private region = '';
    constructor() {
        this.cos = new COS({
            SecretId: process.env.COS_SECRET_ID,
            SecretKey: process.env.COS_SECRET_KEY
        })
        this.bucket_img = process.env.COS_IMG_BUCKET;
        this.bucket_pdf = process.env.COS_PDF_BUCKET;
        this.region = process.env.COS_REGION;
    }

    @Post('pmimg')
    @UseInterceptors(
        FileInterceptor('img', {
            fileFilter: (req, file, callback) => {

                // 限制文件大小最大为 2mb
                if (file.size > 2 * 1024 * 1024) {
                    callback(new FileTooLargeException(), false); // 拒绝上传
                }

                // 
                const allowedMimes = ['image/jpeg', 'image/png']; // 允许的图片上传类型
                if (allowedMimes.includes(file.mimetype)) {
                    callback(null, true); // 允许上传
                } else {
                    callback(new InvalidImageFormatException(), false); // 拒绝上传
                }
            },
        }),
    )
    async uploadPermissionImg(@UploadedFile() file, @Body('token') token) {
        // 处理上传的文件
        //返回图片的地址
        // TODO 判断用户token是否合法
        // 建立图片上传表记录用户图片上传记录
        // 判断file是否为空
        if (!file) {
            throw new EmptyFileException();
        }
        // 随机32位name
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        this.cos.putObject({
            Bucket: this.bucket_img,
            Region: this.region,
            Key: randomName + extname(file.originalname),
            Body: file.buffer
        } as COS.PutObjectParams, (err, data) => {
            if (err) {
                throw new FileUploadException()
            }
        })
        // 返回 图片宽度 100px 质量 30
        return 'https://' + this.bucket_img + '.cos.' + this.region + '.myqcloud.com/' + randomName + extname(file.originalname);
    }





    // PDF文件上传
    @Post('pmpdf')
    @UseInterceptors(
        FileInterceptor('pdf', {
            fileFilter: (req, file, callback) => {
                // 限制文件大小最大为 2mb
                if (file.size > 2 * 1024 * 1024) {
                    callback(new FileTooLargeException(), false); // 拒绝上传
                }
                const allowedMimes = ['application/pdf']; // 允许的图片上传类型
                if (allowedMimes.includes(file.mimetype)) {
                    callback(null, true); // 允许上传
                } else {
                    callback(new InvalidPDFFormatException(), false); // 拒绝上传
                }

            },
        }),
    )
    async uploadPermissionPdf(@UploadedFile() file, @Body('token') token) {
        // 处理上传的文件
        //返回pdf的地址
        // TODO 判断用户token是否合法
        // 建立图片上传表记录用户图片上传记录
        if (token) { }
        if (!file) {
            throw new EmptyFileException();
        }
        // 随机32位name
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        this.cos.putObject({
            Bucket: this.bucket_pdf,
            Region: this.region,
            Key: randomName + extname(file.originalname),
            Body: file.buffer
        } as COS.PutObjectParams, (err, data) => {
            if (err) {
                throw new FileUploadException()
            }
        })
        // 控制宽度 200 质量 50
        return 'https://' + this.bucket_pdf + '.cos.' + this.region + '.myqcloud.com/' + randomName + extname(file.originalname);
    }

}
