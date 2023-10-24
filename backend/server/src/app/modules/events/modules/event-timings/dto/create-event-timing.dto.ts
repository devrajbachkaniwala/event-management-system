import { IsDate, IsString, Matches } from 'class-validator';
import { IsEndTimeValid, IsFutureDate, IsStartTimeValid } from '../decorators';
import { Type } from 'class-transformer';

export class CreateEventTimingDto {
  @IsDate()
  @Type(() => Date)
  @IsFutureDate()
  date: Date;

  @IsString()
  @Matches(new RegExp(/^[0-2][0-9]:[0-5][0-9]$/))
  @IsStartTimeValid()
  startTime: string;

  @IsString()
  @Matches(new RegExp(/^[0-2][0-9]:[0-5][0-9]$/))
  @IsEndTimeValid()
  endTime: string;
}
