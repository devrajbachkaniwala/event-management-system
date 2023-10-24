import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

enum FutureDateValidatorError {
  REQUIRED
}

@ValidatorConstraint({ name: 'futureDateValidator', async: false })
export class FutureDateValidator implements ValidatorConstraintInterface {
  error: FutureDateValidatorError;

  validate(date: Date, args: ValidationArguments) {
    if (!date) {
      this.error = FutureDateValidatorError.REQUIRED;
      return false;
    }

    const dateString = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    const curDate = new Date();
    const curDateString = `${curDate.getFullYear()}-${
      curDate.getMonth() + 1
    }-${curDate.getDate()}`;

    return new Date(dateString).getTime() > new Date(curDateString).getTime();
  }

  defaultMessage(args: ValidationArguments) {
    switch (this.error) {
      case FutureDateValidatorError.REQUIRED:
        return 'Date value should not be empty';

      default:
        return 'Date should be in future';
    }
  }
}
