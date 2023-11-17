import { FutureDateValidator } from '@/validators/future-date.validator';
import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'futureDateValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: FutureDateValidator
    });
  };
}
