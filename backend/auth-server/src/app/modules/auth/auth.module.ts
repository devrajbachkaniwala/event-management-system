import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy, JwtRefreshStrategy } from './strategies';
import {
  AuthService,
  JwtTokenService,
  authServiceToken,
  jwtTokenServiceToken
} from './services';
import { AuthController } from './controllers';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ signOptions: { expiresIn: '2h' } })
  ],
  providers: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    { provide: jwtTokenServiceToken, useClass: JwtTokenService },
    { provide: authServiceToken, useClass: AuthService }
  ],
  controllers: [AuthController]
})
export class AuthModule {}
