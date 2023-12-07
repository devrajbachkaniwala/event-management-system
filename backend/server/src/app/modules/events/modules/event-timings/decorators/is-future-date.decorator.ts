import { ValidationOptions, registerDecorator } from 'class-validator';
import { FutureDateValidator } from '../validators';

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
