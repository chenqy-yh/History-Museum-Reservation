import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class StringArrayParsePipe implements PipeTransform<string[], string[]>{
    transform(value: string[], metadata: ArgumentMetadata): string[] {
        if (value === undefined) return [];
        return value;
    }
}


// 月份格式yyyy-MM 年份不足4位补0 月份不足2位补0
@Injectable()
export class MonthListFormatPipe implements PipeTransform<string[], string[]>{
    transform(value: string[], metadata: ArgumentMetadata): string[] {
        if (value === undefined) return [];
        return value.map(item => {
            const [year, month] = item.split('-');
            return `${year.padStart(4, '0')}-${month.padStart(2, '0')}`
        });
    }
}