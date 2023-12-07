import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  fullName?: string;
}
