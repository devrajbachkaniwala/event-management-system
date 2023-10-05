import { OmitType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';
import { Role, User } from '@prisma/client';

export class UserDto extends OmitType(RegisterUserDto, [
  'confirmPassword',
  'password'
] as const) {
  id: string;
  userPhotoUrl: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;

  static create(userData: User) {
    const user = new UserDto();
    user.id = userData.id;
    user.username = userData.username;
    user.fullName = userData.fullName;
    user.email = userData.email;
    user.isActive = userData.isActive;
    user.userPhotoUrl = userData.userPhotoUrl;
    user.role = userData.role;
    user.createdAt = userData.createdAt;
    user.modifiedAt = userData.modifiedAt;

    return user;
  }
}
