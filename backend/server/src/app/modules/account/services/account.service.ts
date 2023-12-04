import { Inject, Injectable } from '@nestjs/common';
import { IAccountService } from './account-service.interface';
import { UpdateUserProfileDto } from '../dto';
import { UserDto, UserDtoFactory } from 'src/app/dto';
import { AccountErrorFactory } from '../errors';
import { ConfigService } from '@nestjs/config';
import {
  IDaoFactory,
  daoFactoryToken
} from '../../dao/dao-factory/dao-factory.interface';
import { IUserDao } from '../../dao/user-dao/user-dao.interface';

@Injectable()
export class AccountService implements IAccountService {
  private userDao: IUserDao;

  constructor(
    @Inject(daoFactoryToken) daoFactory: IDaoFactory,
    private readonly configService: ConfigService
  ) {
    this.userDao = daoFactory.getUserDao();
  }

  async updateUserProfile(
    userId: string,
    updateUserProfile: UpdateUserProfileDto,
    userPhotoFile: Express.Multer.File
  ): Promise<UserDto> {
    try {
      const photoUrl = userPhotoFile
        ? this.generatePhotoUrl(userPhotoFile.filename)
        : undefined;

      const user = await this.userDao.update(userId, {
        ...updateUserProfile,
        photoUrl
      });

      return UserDtoFactory.create(user);
    } catch (err: any) {
      throw AccountErrorFactory.create(err, 'Failed to update user profile');
    }
  }

  async getUserProfile(userId: string): Promise<UserDto> {
    try {
      const user = await this.userDao.findById(userId);

      return UserDtoFactory.create(user);
    } catch (err: any) {
      throw AccountErrorFactory.create(err, 'Failed to get user profile');
    }
  }

  private generatePhotoUrl(filename: string): string {
    return `${this.configService.get(
      'SERVER_URL'
    )}/v1/account/user-photos/${filename}`;
  }
}
