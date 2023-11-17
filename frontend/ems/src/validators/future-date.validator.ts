import { DateService } from '@/services/date-service';
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

    // const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${
    //   date.getDate().toString().length == 1 ? 0 : ''
    // }${date.getDate()}`;

    const dateString = DateService.getDateString(date, 'yyyy-MM-dd');

    const curDate = new Date();
    // const curDateString = `${curDate.getFullYear()}-${curDate.getMonth() + 1}-${
    //   curDate.getDate().toString().length == 1 ? 0 : ''
    // }${curDate.getDate()}`;
    const curDateString = DateService.getDateString(curDate, 'yyyy-MM-dd');

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
