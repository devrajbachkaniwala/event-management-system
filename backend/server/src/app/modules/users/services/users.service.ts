import { Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './users-service.interface';
import { ModerateUserDto } from '../dto';
import {
  TUserInclude,
  UserDto,
  UserDtoFactory,
  UserInclude
} from 'src/app/dto';
import { UserError, UserErrorFactory } from '../errors';
import { IBookingsService, bookingsServiceToken } from '../../bookings';
import { User } from '@prisma/client';
import {
  IDaoFactory,
  daoFactoryToken
} from '../../dao/dao-factory/dao-factory.interface';
import { IUserDao } from '../../dao/user-dao/user-dao.interface';

@Injectable()
export class UsersService implements IUsersService {
  private userDao: IUserDao;

  constructor(
    @Inject(bookingsServiceToken)
    private readonly bookingsServie: IBookingsService,
    @Inject(daoFactoryToken) daoFactory: IDaoFactory
  ) {
    this.userDao = daoFactory.getUserDao();
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll(): Promise<UserDto[]> {
    try {
      const users = await this.userDao.findAll();

      return users.map(UserDtoFactory.create);
    } catch (err: any) {
      throw UserErrorFactory.create(err, 'Failed to get all users');
    }
  }

  async findOne(
    userId: string,
    includeValues: string[] = [],
    bookingIncludes: string[] = []
  ): Promise<UserDto> {
    try {
      const includeKeyVal: Partial<Record<UserInclude, boolean>> = {};

      includeValues.forEach((item) => {
        includeKeyVal[item] = true;
      });

      const user = await this.userDao.findById(userId);

      if (!user) {
        throw new UserError('User not found', 404);
      }

      const data: User & TUserInclude = { ...user };

      if (includeKeyVal.bookings) {
        data.bookings = await this.bookingsServie.findAll(
          userId,
          bookingIncludes
        );
      }

      return UserDtoFactory.create(data);
    } catch (err: any) {
      throw UserErrorFactory.create(err, 'Failed to get a user');
    }
  }

  async moderateUser(
    userId: string,
    moderateUserDto: ModerateUserDto
  ): Promise<UserDto> {
    try {
      const user = await this.userDao.update(userId, {
        isActive: moderateUserDto.isActive
      });

      return UserDtoFactory.create(user);
    } catch (err: any) {
      throw UserErrorFactory.create(err, 'Failed to moderate a user');
    }
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
