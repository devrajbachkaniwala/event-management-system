import { UserToken } from '@prisma/client';

export class TokenDto {
  accessToken: string;
  refreshToken: string;

  constructor(tokens: Pick<UserToken, 'accessToken' | 'refreshToken'>) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }

  static create(tokens: Pick<UserToken, 'accessToken' | 'refreshToken'>) {
    return new TokenDto(tokens);
  }
}
