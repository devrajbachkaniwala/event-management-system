import { IsConfirmPasswordValid } from '@/decorators/confirm-password.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(40)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    new RegExp(
      `^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!"\#$%&'()*+,\-./:;<=>?@\[\\\]^_‘{|}~]).{8,20}$`,
      'g'
    ),
    {
      message:
        'Password length should be in between 8 to 20 and contain at least one digit, lowercase, uppercase & special symbol'
    }
  )
  password: string;

  @IsConfirmPasswordValid()
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
