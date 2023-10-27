import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { IsNumberGteZero } from '../decorators';
import { Type } from 'class-transformer';

export class CreateEventPriceDto {
  @IsNotEmpty()
  @IsNumber()
  @IsNumberGteZero()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currency: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsNumberGteZero()
  maxLimit?: number;
}
