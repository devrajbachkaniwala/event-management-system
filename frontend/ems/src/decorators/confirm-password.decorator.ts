import { ConfirmPasswordValidator } from '@/validators/confirm-password.validators';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsConfirmPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'confirmPasswordValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: ConfirmPasswordValidator
    });
  };
}
