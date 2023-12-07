import { UserToken } from '@prisma/client';
import { IUserTokenDao, TCreateUserTokenDto } from './user-token-dao.interface';
import { DaoError } from '../errors/dao.error';
import { Inject } from '@nestjs/common';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';

export class UserTokenDaoImpl implements IUserTokenDao {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    userId: string,
    createUserTokenDto: TCreateUserTokenDto
  ): Promise<UserToken> {
    try {
      const userToken = await this.prisma.userToken.create({
        data: {
          accessToken: createUserTokenDto.accessJti,
          refreshToken: createUserTokenDto.refreshJti,
          accessTokenExpiredAt: new Date(
            createUserTokenDto.accessTokenExpiredAt
          ),
          refreshTokenExpiredAt: new Date(
            createUserTokenDto.refreshTokenExpiredAt
          ),
          userId
        }
      });

      return userToken;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async updateAllByUserId(
    userId: string,
    updateUserTokenDto: Partial<TCreateUserTokenDto>
  ): Promise<boolean> {
    try {
      const userTokens = await this.prisma.userToken.updateMany({
        where: {
          userId
        },
        data: {
          //   accessToken: updateUserTokenDto.accessJti,
          //   refreshToken: updateUserTokenDto.refreshJti,
          accessTokenExpiredAt: updateUserTokenDto.accessTokenExpiredAt,
          refreshTokenExpiredAt: updateUserTokenDto.refreshTokenExpiredAt
        }
      });

      return !!userTokens.count;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async updateByAccessJti(
    userId: string,
    accessJti: string,
    updateUserTokenDto: Partial<TCreateUserTokenDto>
  ): Promise<UserToken> {
    try {
      const userToken = await this.prisma.userToken.update({
        where: {
          accessToken: accessJti,
          userId
        },
        data: {
          refreshToken: updateUserTokenDto.refreshJti,
          accessTokenExpiredAt: updateUserTokenDto.accessTokenExpiredAt,
          refreshTokenExpiredAt: updateUserTokenDto.refreshTokenExpiredAt
        }
      });

      return userToken;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async updateByRefreshJti(
    userId: string,
    refreshJti: string,
    updateUserTokenDto: Partial<TCreateUserTokenDto>
  ): Promise<UserToken> {
    try {
      const userToken = await this.prisma.userToken.update({
        where: {
          refreshToken: refreshJti,
          userId
        },
        data: {
          accessToken: updateUserTokenDto.accessJti,
          accessTokenExpiredAt: updateUserTokenDto.accessTokenExpiredAt,
          refreshTokenExpiredAt: updateUserTokenDto.refreshTokenExpiredAt
        }
      });

      return userToken;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }
}
