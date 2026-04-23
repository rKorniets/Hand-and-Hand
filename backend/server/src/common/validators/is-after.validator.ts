import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfter',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as [string];
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];
          if (value === undefined || value === null) return true;
          if (relatedValue === undefined || relatedValue === null) return true;
          const end = new Date(value as string | Date).getTime();
          const start = new Date(relatedValue as string | Date).getTime();
          if (Number.isNaN(end) || Number.isNaN(start)) return false;
          return end > start;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as [string];
          return `${args.property} must be after ${relatedPropertyName}`;
        },
      },
    });
  };
}
