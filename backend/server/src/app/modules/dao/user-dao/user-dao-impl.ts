import { $Enums, User, UserToken } from '@prisma/client';
import { IUserDao, TCreateUser, TUpdateUser } from './user-dao.interface';
import { DaoError } from '../errors/dao.error';
import { Inject } from '@nestjs/common';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';

export class UserDaoImpl implements IUserDao {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(createUserDto: TCreateUser): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          fullName: createUserDto.fullName,
          username: createUserDto.username,
          email: createUserDto.email,
          password: createUserDto.password,
          role: createUserDto.role,
          userPhotoUrl: createUserDto.photoUrl
        }
      });

      return user;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany();

      return users;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findById(userId: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        }
      });

      return user;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email
        }
      });

      return user;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async update(userId: string, updateUserDto: TUpdateUser): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          fullName: updateUserDto.fullName,
          username: updateUserDto.username,
          userPhotoUrl: updateUserDto.photoUrl,
          role: updateUserDto.role,
          isActive: updateUserDto.isActive
        }
      });

      return user;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async remove(userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: userId
        }
      });

      return true;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async getUserByAccessJti(
    userId: string,
    accessJti: string
  ): Promise<User & { tokens: UserToken[] }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        },
        include: {
          tokens: {
            where: {
              accessToken: accessJti
            }
          }
        }
      });

      return user;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async getUserByRefreshJti(
    userId: string,
    refreshJti: string
  ): Promise<User & { tokens: UserToken[] }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        },
        include: {
          tokens: {
            where: {
              refreshToken: refreshJti
            }
          }
        }
      });

      return user;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }
}
