import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventPriceDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'currency must be 3 characters long'
  })
  @MaxLength(3, {
    message: 'currency must be 3 characters long'
  })
  currency: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maxLimit?: number;
}
