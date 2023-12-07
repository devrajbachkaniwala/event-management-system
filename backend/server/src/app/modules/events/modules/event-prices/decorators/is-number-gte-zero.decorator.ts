import { ValidationOptions, registerDecorator } from 'class-validator';
import { NumberGteZeroValidator } from '../validators';

export function IsNumberGteZero(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'numberGteZeroValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: NumberGteZeroValidator
    });
  };
}
