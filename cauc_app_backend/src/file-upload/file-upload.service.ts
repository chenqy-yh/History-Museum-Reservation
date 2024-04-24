import { Injectable } from '@nestjs/common';
import * as COS from 'cos-nodejs-sdk-v5';
import * as fs from 'fs';
import { extname } from 'path';
import { EmptyFileException, FileUploadException } from '../error';
import { fromPath } from 'pdf2pic'


@Injectable()
export class FileUploadService {
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

    //上传图片
    async uploadPermissionImg(file: any, token: string) {
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


    // 生成随机文件名
    private generateRandomName(): string {
        return Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
    }


    // 保存pdf到临时文件夹
    private async savePdfToTempFile(fileBuffer: Buffer, fileName: string): Promise<string> {
        const pdfDirectory = '/tmp/pdf/';
        if (!fs.existsSync(pdfDirectory)) {
            fs.mkdirSync(pdfDirectory, { recursive: true });
        }

        const pdfFilePath = `/tmp/pdf/${fileName}.pdf`;
        await fs.promises.writeFile(pdfFilePath, fileBuffer);
        return pdfFilePath;
    }

    // 将pdf转换为图片
    private async convertPdfToImage(pdfFilePath: string): Promise<string> {
        const convert = fromPath(pdfFilePath, {
            density: 100,
            saveFilename: 'output',
            savePath: '/tmp/images',
            format: 'png',
            // 宽高设置为A4纸的尺寸
            width: 2480,
            height: 3508,
        });


        const pageToConvertAsImage = 1;
        const result = await convert(pageToConvertAsImage, { responseType: 'image' });
        return result.path;
    }


    // 上传图片到腾讯云对象存储
    private async uploadImageToCos(imagePath: string, fileName: string): Promise<void> {
        const imageData = await fs.promises.readFile(imagePath);
        await this.cos.putObject({
            Bucket: this.bucket_pdf,
            Region: this.region,
            Key: `${fileName}.png`,
            Body: imageData,
        } as COS.PutObjectParams);
    }

    // 上传pdf 并返回图片地址 Linux
    public async uploadPermissionPdfForLinux(file: any): Promise<string> {
        if (!file) {
            // 处理空文件
            throw new EmptyFileException();
        }

        const randomName = this.generateRandomName();
        const pdfFilePath = await this.savePdfToTempFile(file.buffer, randomName);
        const imagePath = await this.convertPdfToImage(pdfFilePath);

        try {
            await this.uploadImageToCos(imagePath, randomName);

            // 删除临时文件
            fs.unlinkSync(pdfFilePath);
            fs.unlinkSync(imagePath);

            return `https://${this.bucket_pdf}.cos.${this.region}.myqcloud.com/${randomName}.png`;
        } catch (err) {
            console.log(err);
            throw new FileUploadException();
        }
    }



    async uploadPermissionPdfForWIN(file: any) {
        // if (!file) {
        //     // 处理空文件
        //     throw new EmptyFileException();
        // }

        // const randomName = Array(32)
        //     .fill(null)
        //     .map(() => Math.round(Math.random() * 16).toString(16))
        //     .join('');

        // try {
        //     // 将传入的pdf保存到临时文件夹中
        //     await fs.promises.writeFile(`./${file.originalname}.pdf`, file.buffer);

        //     const opts = {
        //         format: 'png',
        //         out_dir: './output',
        //         out_prefix: 'image',
        //         page: 1,
        //     };

        //     // 调用pdf-poppler的convert方法将PDF转换为图片
        //     await pdfPoppler.convert(`./${file.originalname}.pdf`, opts);

        //     // 将生成的图片保存到腾讯云对象存储中
        //     const imageData = await fs.promises.readFile(`./output/${opts.out_prefix}-${opts.page}.${opts.format}`);
        //     await this.cos.putObject({
        //         Bucket: this.bucket_pdf,
        //         Region: this.region,
        //         Key: `${randomName}.png`,
        //         Body: imageData,
        //     } as COS.PutObjectParams);

        //     // 删除临时文件
        //     await fs.promises.unlink(`./${file.originalname}.pdf`);
        //     await fs.promises.unlink(`./output/${opts.out_prefix}-${opts.page}.${opts.format}`);

        //     console.log('图片上传成功');
        //     return `https://${this.bucket_pdf}.cos.${this.region}.myqcloud.com/${randomName}.png`;
        // } catch (error) {
        //     console.error('转换并保存图片出错：', error);
        //     throw new FileUploadException();
        // }
    }
}
