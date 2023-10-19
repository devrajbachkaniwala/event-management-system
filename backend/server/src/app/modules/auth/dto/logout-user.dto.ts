import { IsBoolean, IsOptional } from 'class-validator';

export class LogoutUserDto {
  @IsBoolean()
  @IsOptional()
  allDevices: boolean;
}
