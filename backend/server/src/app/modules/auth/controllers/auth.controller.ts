import {
  Body,
  Controller,
  FileTypeValidator,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { IAuthService, authServiceToken } from '../services';
import {
  LoginUserDto,
  LogoutUserDto,
  RegisterUserDto,
  TokenDto,
  TokensDto
} from '../dto';
import {
  ResErrorDtoFactory,
  ResSuccessDto,
  ResSuccessDtoFactory,
  UserDto
} from 'src/app/dto';
import { JwtAuthRefreshGuard } from '../../../guards';
import { GetReqUser, Public } from 'src/app/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { extname } from 'path';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(authServiceToken) private readonly authService: IAuthService
  ) {}

  @Post('register')
  @Public()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/user-photos',
        filename: (req, file, callback) => {
          const name = v4();
          const ext = extname(file.originalname);
          const filename = name + ext;

          callback(null, filename);
        }
      })
    })
  )
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 80000,
            message: 'Photo cannot exceed 80kb'
          }),
          new FileTypeValidator({
            fileType: /.(jpg|jpeg|png)$/
          })
        ]
      })
    )
    file: Express.Multer.File
  ): Promise<ResSuccessDto<UserDto>> {
    let user: UserDto = null;
    try {
      user = await this.authService.register(registerUserDto, file);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to register user');
    }

    return ResSuccessDtoFactory.create<UserDto>(user);
  }

  @Post('login')
  @Public()
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
  @Public()
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
