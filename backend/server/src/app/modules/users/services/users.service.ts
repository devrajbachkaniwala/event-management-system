import { Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './users-service.interface';
import { ModerateUserDto } from '../dto';
import {
  TUserInclude,
  UserDto,
  UserDtoFactory,
  UserInclude
} from 'src/app/dto';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';
import { UserError, UserErrorFactory } from '../errors';
import { IBookingsService, bookingsServiceToken } from '../../bookings';
import { User } from '@prisma/client';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService,
    @Inject(bookingsServiceToken)
    private readonly bookingsServie: IBookingsService
  ) {}

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll(): Promise<UserDto[]> {
    try {
      const users = await this.prisma.user.findMany();

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

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        }
      });

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
      const user = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          isActive: moderateUserDto.isActive
        }
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
