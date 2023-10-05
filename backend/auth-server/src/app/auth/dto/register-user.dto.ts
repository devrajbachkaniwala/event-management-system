import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { IsConfirmPasswordValid } from '../decorators';
import { UserDto } from './user.dto';
import { ResponseSuccessDto } from 'src/app/dto/response-success.dto';

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
  //   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'password too weak'
  //   })
  password: string;

  @IsConfirmPasswordValid()
  @IsNotEmpty()
  @IsString()
  //   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'password too weak'
  //   })
  confirmPassword: string;
}

export class ResponseRegisterUserSuccessDto extends ResponseSuccessDto<UserDto> {}
