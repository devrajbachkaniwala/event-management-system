import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdateBookingDto {
  @IsNotEmpty()
  @IsString()
  @Matches(new RegExp(/^cancel$/, 'i'), {
    message: 'Booking status should be cancel'
  })
  status: string;
}
