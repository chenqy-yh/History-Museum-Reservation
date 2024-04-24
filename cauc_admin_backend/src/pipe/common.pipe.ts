import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class NumberParsePipe implements PipeTransform<string | number, number>{
    transform(value: string | number, metadata: ArgumentMetadata): number {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            // check is number
            if (isNaN(+value)) {
                throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
            }
            return +value;
        }
    }
}