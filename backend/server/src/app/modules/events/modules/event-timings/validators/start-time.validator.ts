import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

enum StartTimeValidatorError {
  REQUIRED
}

@ValidatorConstraint({ name: 'startTimeValidator', async: false })
export class StartTimeValidator implements ValidatorConstraintInterface {
  error: StartTimeValidatorError;

  validate(startTime: string, args: ValidationArguments) {
    const { date, endTime } = args.object as { date: Date; endTime: string };

    if (!date) {
      this.error = StartTimeValidatorError.REQUIRED;
      return false;
    }

    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${
      date.getDate().toString().length == 1 ? 0 : ''
    }${date.getDate()}`;

    const startDateTime = new Date(`${dateString}T${startTime}`);
    const endDateTime = new Date(`${dateString}T${endTime}`);
    return startDateTime.getTime() < endDateTime.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    switch (this.error) {
      case StartTimeValidatorError.REQUIRED:
        return 'Start time should not be empty';

      default:
        return 'Start time should be before end time';
    }
  }
}
