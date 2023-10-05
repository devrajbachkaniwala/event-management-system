import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
  ResponseRegisterUserSuccessDto,
  TokenDto
} from './dto';
import { AuthService } from './auth.service';
import { AuthError } from './errors';
import { UserDto } from './dto/user.dto';
import { ResponseErrorDto } from '../dto';
import { JwtAuthGuard, JwtAuthRefreshGuard } from './guards';
import { Request } from 'express';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // login() {
  //   return 'Login hello world';
  // }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    let user: UserDto = null;
    try {
      user = await this.authService.register(registerUserDto);
    } catch (err: any) {
      throw ResponseErrorDto.create(err);
    }

    return ResponseRegisterUserSuccessDto.create(user);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    let tokens: TokenDto = null;
    try {
      tokens = await this.authService.login(loginUserDto);
    } catch (err: any) {
      if (err instanceof AuthError) {
        throw new BadRequestException({
          statusCode: err.statusCode,
          message: err.message
        });
      }
      throw new BadRequestException({
        statusCode: 400,
        message: 'Failed to login user'
      });
    }

    return tokens;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    const user = req.user as typeof req.user & { user: UserDto; jti: string };
    let isLogout = false;

    try {
      isLogout = await this.authService.logout(user.user, user.jti);
    } catch (err: any) {
      throw ResponseErrorDto.create(err);
    }

    return { message: 'Success' };
  }

  @Post('token')
  @UseGuards(JwtAuthRefreshGuard)
  async token(@Req() req: Request) {
    const user = req.user as typeof req.user & { user: UserDto; jti: string };
    let token: Omit<TokenDto, 'refreshToken'> = null;

    try {
      token = await this.authService.token(user.user, user.jti);
    } catch (err: any) {
      throw ResponseErrorDto.create(err);
    }

    return token;
  }
}
