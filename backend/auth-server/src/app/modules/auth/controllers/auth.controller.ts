import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { IAuthService, authServiceToken } from '../services';
import { LoginUserDto, RegisterUserDto, TokenDto, TokensDto } from '../dto';
import {
  ResErrorDtoFactory,
  ResSuccessDto,
  ResSuccessDtoFactory,
  UserDto
} from 'src/app/dto';
import { JwtAuthAccessGuard, JwtAuthRefreshGuard } from '../../../guards';
import { Request } from 'express';
import { LogoutUserDto } from '../dto/logout-user.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(authServiceToken) private readonly authService: IAuthService
  ) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto
  ): Promise<ResSuccessDto<UserDto>> {
    let user: UserDto = null;
    try {
      user = await this.authService.register(registerUserDto);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to register user');
    }

    return ResSuccessDtoFactory.create<UserDto>(user);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<ResSuccessDto<TokensDto>> {
    let tokens: TokensDto = null;
    try {
      tokens = await this.authService.login(loginUserDto);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to login user');
    }

    return ResSuccessDtoFactory.create<TokensDto>(tokens);
  }

  @Post('logout')
  @UseGuards(JwtAuthAccessGuard)
  async logout(
    @Req() req: Request,
    @Body() logoutUserDto: LogoutUserDto
  ): Promise<ResSuccessDto<{ message: string }>> {
    const user = req.user as typeof req.user & {
      user: UserDto;
      jti: string;
    };
    let isLogout = false;

    try {
      isLogout = await this.authService.logout(
        user.user?.id,
        user.jti,
        logoutUserDto
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to logout user');
    }

    const message = `Successfully logged out${
      logoutUserDto.allDevices ? ' of all devices' : ''
    }`;

    return ResSuccessDtoFactory.create({ message });
  }

  @Post('token')
  @UseGuards(JwtAuthRefreshGuard)
  async token(@Req() req: Request): Promise<ResSuccessDto<TokenDto>> {
    const user = req.user as typeof req.user & {
      user: UserDto;
      jti: string;
    };
    let token: TokenDto = null;

    try {
      token = await this.authService.token(user.user, user.jti);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err);
    }

    return ResSuccessDtoFactory.create(token);
  }
}
