import { Inject, Injectable } from '@nestjs/common';
import { IAccountService } from './account-service.interface';
import { IPrismaService, prismaServiceToken } from '../../prisma';
import { UpdateUserProfileDto } from '../dto';
import { UserDto, UserDtoFactory } from 'src/app/dto';
import { AccountErrorFactory } from '../errors';

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(prismaServiceToken) private readonly prisma: IPrismaService
  ) {}

  async updateUserProfile(
    userId: string,
    updateUserProfile: UpdateUserProfileDto
  ): Promise<UserDto> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          fullName: updateUserProfile.fullName,
          username: updateUserProfile.username
        }
      });

      return UserDtoFactory.create(user);
    } catch (err: any) {
      throw AccountErrorFactory.create(err, 'Failed to update user profile');
    }
  }
}
