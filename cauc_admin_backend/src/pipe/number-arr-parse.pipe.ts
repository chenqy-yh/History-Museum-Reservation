import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class NumberArrayParsePipe implements PipeTransform<string[], number[]>{
    transform(value: string[], metadata: ArgumentMetadata): number[] {
        if(value===undefined) return [];
        return value.map(item => +item);
    }
}