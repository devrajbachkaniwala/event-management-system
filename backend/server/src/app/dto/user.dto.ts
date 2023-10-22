import { Role, User } from '@prisma/client';

export class UserDto {
  id: string;
  username: string;
  userPhotoUrl: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;
  orgId: string;
}

export class UserDtoFactory {
  static create(userData: User): UserDto {
    const userDto: UserDto = new UserDto();
    userDto.id = userData.id;
    userDto.username = userData.username;
    userDto.fullName = userData.fullName;
    userDto.email = userData.email;
    userDto.isActive = userData.isActive;
    userDto.userPhotoUrl = userData.userPhotoUrl;
    userDto.role = userData.role;
    userDto.createdAt = userData.createdAt;
    userDto.modifiedAt = userData.modifiedAt;
    userDto.orgId = userData.orgId;

    return userDto;
  }
}
