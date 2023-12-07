import { ValidationOptions, registerDecorator } from 'class-validator';
import { StartTimeValidator } from '../validators';

export function IsStartTimeValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'startTimeValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: StartTimeValidator
    });
  };
}
