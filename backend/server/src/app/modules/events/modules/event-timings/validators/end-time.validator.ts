import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

enum EndTimeValidatorError {
  REQUIRED
}

@ValidatorConstraint({ name: 'endTimeValidator', async: false })
export class EndTimeValidator implements ValidatorConstraintInterface {
  error: EndTimeValidatorError;

  validate(endTime: string, args: ValidationArguments) {
    const { date, startTime } = args.object as {
      date: Date;
      startTime: string;
    };

    if (!date) {
      this.error = EndTimeValidatorError.REQUIRED;
      return false;
    }

    const dateString = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    const startDateTime = new Date(`${dateString}T${startTime}`);
    const endDateTime = new Date(`${dateString}T${endTime}`);
    return endDateTime.getTime() > startDateTime.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    switch (this.error) {
      case EndTimeValidatorError.REQUIRED:
        return 'End time should not be empty';

      default:
        return 'End time should be after start time';
    }
  }
}
