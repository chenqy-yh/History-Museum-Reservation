import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [MulterModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule { }
