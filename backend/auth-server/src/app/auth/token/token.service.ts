import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  generateAccess(payload: any, options: JwtSignOptions): string {
    // payload.jti = options.jwtid;
    // payload.iat = options.iat.getTime() / 1000;

    return this.jwtService.sign(payload, {
      ...options,
      secret: this.configService.get<string>('ACCESS_SALT')
    });
  }

  generateRefresh(payload: any, options: JwtSignOptions): string {
    // payload.jti = options.jwtid;
    // payload.iat = options.iat.getTime() / 1000;

    return this.jwtService.sign(payload, {
      ...options,
      secret: this.configService.get<string>('REFRESH_SALT')
    });
  }
}
