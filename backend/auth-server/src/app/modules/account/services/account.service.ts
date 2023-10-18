import { Inject, Injectable } from '@nestjs/common';
import { IAccountService } from './account-service.interface';
import { IPrismaService, prismaServiceToken } from '../../prisma';
import { UpdateUserProfileDto } from '../dto';
import { UserDto, UserDtoFactory } from 'src/app/dto';
import { AccountErrorFactory } from '../errors';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(prismaServiceToken) private readonly prisma: IPrismaService,
    private readonly configService: ConfigService
  ) {}

  async updateUserProfile(
    userId: string,
    updateUserProfile: UpdateUserProfileDto,
    userPhotoFile: Express.Multer.File
  ): Promise<UserDto> {
    try {
      const photoUrl = userPhotoFile
        ? this.generatePhotoUrl(userPhotoFile.filename)
        : undefined;

      const user = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          fullName: updateUserProfile.fullName,
          username: updateUserProfile.username,
          userPhotoUrl: photoUrl
        }
      });

      return UserDtoFactory.create(user);
    } catch (err: any) {
      throw AccountErrorFactory.create(err, 'Failed to update user profile');
    }
  }

  async getUserProfile(userId: string): Promise<UserDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        }
      });

      return UserDtoFactory.create(user);
    } catch (err: any) {
      throw AccountErrorFactory.create(err, 'Failed to get user profile');
    }
  }

  private generatePhotoUrl(filename: string): string {
    return `${this.configService.get(
      'AUTH_SERVER_URL'
    )}/v1/account/user-photos/${filename}`;
  }
}
