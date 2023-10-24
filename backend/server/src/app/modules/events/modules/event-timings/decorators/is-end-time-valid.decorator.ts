import { ValidationOptions, registerDecorator } from 'class-validator';
import { EndTimeValidator } from '../validators';

export function IsEndTimeValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'endTimeValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: EndTimeValidator
    });
  };
}
