import { Module, Provider } from '@nestjs/common';
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

const jwtTokenServiceProvider: Provider = {
  provide: jwtTokenServiceToken,
  useClass: JwtTokenService
};

const authServiceProvider: Provider = {
  provide: authServiceToken,
  useClass: AuthService
};

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ signOptions: { expiresIn: '2h' } })
  ],
  providers: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    jwtTokenServiceProvider,
    authServiceProvider
  ],
  controllers: [AuthController]
})
export class AuthModule {}
