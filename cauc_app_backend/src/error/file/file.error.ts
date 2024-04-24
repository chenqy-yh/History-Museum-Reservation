import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpCode } from '../../utils/enum';
// 图片格式错误
export class InvalidImageFormatException extends HttpException {
  constructor() {
    super('上传图片格式错误', HttpCode.InvalidImageFormat);
  }
}

// pDF格式错误
export class InvalidPDFFormatException extends HttpException {
  constructor() {
    super('上传PDF格式错误', HttpCode.InvalidPDFFormat);
  }
}

// 文件大小超过限制
export class FileTooLargeException extends HttpException {
  constructor() {
    super('文件大小超过限制', HttpCode.FileTooLarge);
  }
}

//空文件异常
export class EmptyFileException extends HttpException {
  constructor() {
    super('上传文件为空', HttpStatus.BAD_REQUEST);
  }
}

// 文件上传异常
export class FileUploadException extends HttpException {
  constructor() {
    super('文件上传异常', HttpStatus.BAD_REQUEST);
  }
}
