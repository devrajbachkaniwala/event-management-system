import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IJwtTokenService } from './jwt-token-service.interface';

@Injectable()
export class JwtTokenService implements IJwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  generateAccess(payload: any, options: JwtSignOptions): string {
    return this.jwtService.sign(payload, {
      ...options,
      secret: this.configService.get<string>('ACCESS_SALT')
    });
  }

  generateRefresh(payload: any, options: JwtSignOptions): string {
    return this.jwtService.sign(payload, {
      ...options,
      secret: this.configService.get<string>('REFRESH_SALT')
    });
  }
}
