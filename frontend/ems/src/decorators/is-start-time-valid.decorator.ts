import { StartTimeValidator } from '@/validators/start-time.validator';
import { ValidationOptions, registerDecorator } from 'class-validator';

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
