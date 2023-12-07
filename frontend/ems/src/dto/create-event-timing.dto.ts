import { IsDate, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { IsFutureDate } from '@/decorators/is-future-date.decorator';
import { IsStartTimeValid } from '@/decorators/is-start-time-valid.decorator';
import { IsEndTimeValid } from '@/decorators/is-end-time-valid.decorator';

export class CreateEventTimingDto {
  @IsDate()
  @Type(() => Date)
  @IsFutureDate()
  date: string;

  @IsString()
  @Matches(new RegExp(/^[0-2][0-9]:[0-5][0-9]$/))
  @IsStartTimeValid()
  startTime: string;

  @IsString()
  @Matches(new RegExp(/^[0-2][0-9]:[0-5][0-9]$/))
  @IsEndTimeValid()
  endTime: string;
}
