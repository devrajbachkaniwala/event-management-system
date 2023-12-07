import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';

@ValidatorConstraint({ name: 'confirmPasswordValidator', async: false })
export class ConfirmPasswordValidator implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const obj = args.object as typeof args.object & { password: string };
    return confirmPassword === obj.password;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Confirm password does not match with the password';
  }
}
