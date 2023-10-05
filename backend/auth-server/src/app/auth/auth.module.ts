import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token/token.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ signOptions: { expiresIn: '2h' } })
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, TokenService],
  controllers: [AuthController]
})
export class AuthModule {}
