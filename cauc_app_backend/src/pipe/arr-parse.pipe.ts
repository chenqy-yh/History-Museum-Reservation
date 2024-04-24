import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ArrayParsePipe implements PipeTransform<string[], number[]>{
    transform(value: string[], metadata: ArgumentMetadata): number[] {
        if (value === undefined) return [];
        return value.map(item => +item);
    }
}

export class NumberParsePipe implements PipeTransform<string | number, number>{
    transform(value: string | number, metadata: ArgumentMetadata): number {
        if (typeof value === 'number') {
            return value;
        }
        return +value;
    }
}