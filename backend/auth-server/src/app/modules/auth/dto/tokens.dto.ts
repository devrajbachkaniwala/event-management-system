export class TokensDto {
  accessToken: string;
  refreshToken: string;
}

export class TokensDtoFactory {
  static create(accessToken: string, refreshToken: string): TokensDto {
    const tokensDto: TokensDto = new TokensDto();
    tokensDto.accessToken = accessToken;
    tokensDto.refreshToken = refreshToken;
    return tokensDto;
  }
}
