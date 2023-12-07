import { EndTimeValidator } from '@/validators/end-time.validator';
import { ValidationOptions, registerDecorator } from 'class-validator';

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
