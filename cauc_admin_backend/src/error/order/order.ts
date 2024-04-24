import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpCode } from '../../utils/enum';
// 图片格式错误
export class QueryOrderCountException extends HttpException {
  constructor() {
    super('查询订单总数失败', HttpCode.OrderCount);
  }
}