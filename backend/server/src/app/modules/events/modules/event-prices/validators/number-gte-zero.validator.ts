import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ name: 'numberGteZeroValidator', async: false })
export class NumberGteZeroValidator implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    return value >= 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Number should be greater than or equal to zero';
  }
}
