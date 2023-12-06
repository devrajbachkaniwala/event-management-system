import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  MinLength
} from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;

  @IsNotEmpty()
  @IsNumberString(undefined, {
    message: 'contact no must be numeric'
  })
  @Length(10, 10, {
    message: 'contact no must be 10 digits'
  })
  contactNo: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
