import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';
import { FileUploadController } from './file-upload.controller';

@Module({
  imports: [MulterModule],
  controllers: [FileUploadController],
})
export class FileUploadModule { }
