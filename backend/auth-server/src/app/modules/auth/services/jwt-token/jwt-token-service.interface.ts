import { JwtSignOptions } from '@nestjs/jwt';

export const jwtTokenServiceToken = Symbol('jwtTokenServiceToken');
export interface IJwtTokenService {
  generateAccess(payload: any, options: JwtSignOptions): string;
  generateRefresh(payload: any, options: JwtSignOptions): string;
}
