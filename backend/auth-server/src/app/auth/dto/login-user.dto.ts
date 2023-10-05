import { OmitType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';
import { TokenDto } from './token.dto';

export class LoginUserDto extends OmitType(RegisterUserDto, [
  'confirmPassword',
  'fullName',
  'username'
] as const) {}

export class ResponseLoginUserSuccess extends TokenDto {}
