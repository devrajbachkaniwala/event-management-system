import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { IsNumberGteZero } from '../decorators';

export class CreateEventPriceDto {
  @IsNotEmpty()
  @IsNumber()
  @IsNumberGteZero()
  price: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currency: string;

  @IsOptional()
  @IsNumber()
  @IsNumberGteZero()
  maxLimit: number;
}
