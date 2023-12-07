import { UserToken } from '@prisma/client';

export type TCreateUserTokenDto = {
  accessJti: string;
  refreshJti: string;
  accessTokenExpiredAt: Date;
  refreshTokenExpiredAt: Date;
};

export type TUpdateUserTokenDto = Partial<TCreateUserTokenDto>;

export const userTokenDaoToken = Symbol('userTokenDaoToken');
export interface IUserTokenDao {
  create(
    userId: string,
    createUserTokenDto: TCreateUserTokenDto
  ): Promise<UserToken>;

  updateAllByUserId(
    userId: string,
    updateUserTokenDto: TUpdateUserTokenDto
  ): Promise<boolean>;

  updateByAccessJti(
    userId: string,
    accessJti: string,
    updateUserTokenDto: TUpdateUserTokenDto
  ): Promise<UserToken>;

  updateByRefreshJti(
    userId: string,
    refreshJti: string,
    updateUserTokenDto: TUpdateUserTokenDto
  ): Promise<UserToken>;
}
