import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { IAuthService, authServiceToken } from '../services';
import { LoginUserDto, RegisterUserDto, TokenDto, TokensDto } from '../dto';
import {
  ResErrorDtoFactory,
  ResSuccessDto,
  ResSuccessDtoFactory,
  UserDto
} from 'src/app/dto';
import { JwtAuthAccessGuard, JwtAuthRefreshGuard } from '../../../guards';
import { LogoutUserDto } from '../dto/logout-user.dto';
import { GetReqUser } from 'src/app/decorators';

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
    @GetReqUser() reqUser: { user: UserDto; jti: string },
    @Body() logoutUserDto: LogoutUserDto
  ): Promise<ResSuccessDto<{ message: string }>> {
    let isLogout = false;

    try {
      isLogout = await this.authService.logout(
        reqUser.user.id,
        reqUser.jti,
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
  async token(
    @GetReqUser() reqUser: { user: UserDto; jti: string }
  ): Promise<ResSuccessDto<TokenDto>> {
    let token: TokenDto = null;

    try {
      token = await this.authService.token(reqUser.user, reqUser.jti);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err);
    }

    return ResSuccessDtoFactory.create(token);
  }
}
