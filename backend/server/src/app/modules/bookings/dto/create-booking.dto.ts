import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsUUID,
  Max,
  Min
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  qty: number;

  @IsNotEmpty()
  @IsMongoId()
  eventId: string;

  @IsNotEmpty()
  @IsMongoId()
  orgId: string;

  @IsNotEmpty()
  @IsUUID()
  priceId: string;

  @IsNotEmpty()
  @IsUUID()
  timingId: string;
}
