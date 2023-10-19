import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/app/dto';
import { IAuthService, authServiceToken } from '../services';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access'
) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(authServiceToken) private readonly authService: IAuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_SALT')
    });
  }

  async validate(payload: {
    user: UserDto;
    jti: string;
    iat: number;
    exp: number;
  }) {
    const validateJti = await this.authService.validateAccessJti(
      payload.user.id,
      payload.jti
    );

    if (!validateJti) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
