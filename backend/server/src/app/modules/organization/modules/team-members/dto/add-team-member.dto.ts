import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddTeamMemberDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
