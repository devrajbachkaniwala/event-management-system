import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ModerateUserDto {
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
