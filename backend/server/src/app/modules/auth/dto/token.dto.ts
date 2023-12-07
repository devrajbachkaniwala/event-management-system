import { OmitType } from '@nestjs/mapped-types';
import { TokensDto } from './tokens.dto';

export class TokenDto extends OmitType(TokensDto, ['refreshToken'] as const) {}

export class TokenDtoFactory {
  static create(accessToken: string): TokenDto {
    const tokenDto: TokenDto = new TokenDto();
    tokenDto.accessToken = accessToken;
    return tokenDto;
  }
}
