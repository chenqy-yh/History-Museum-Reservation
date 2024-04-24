import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

export function validatorFactory(validator_name: string, validate_fn: (val: any) => boolean) {
    return function (property: string, validationOptions?: ValidationOptions) {
        return function (object: Object, propertyName: string) {
            registerDecorator({
                name: validator_name,
                target: object.constructor,
                propertyName: propertyName,
                options: validationOptions,
                validator: {
                    validate(value: any, args: ValidationArguments) {
                        const val = (args.object as any)[property];
                        return validate_fn(val);
                    },
                },
            });
        };
    };
}