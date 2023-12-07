import { UserDto } from 'src/app/dto';
import {
  TokenDto,
  LoginUserDto,
  RegisterUserDto,
  TokensDto,
  LogoutUserDto
} from '../../dto';

export const authServiceToken = Symbol('authServiceToken');
export interface IAuthService {
  register(
    registerUserDto: RegisterUserDto,
    userPhotoFile: Express.Multer.File
  ): Promise<UserDto>;
  login(loginUserDto: LoginUserDto): Promise<TokensDto>;
  logout(
    userId: string,
    accessJti: string,
    logoutUserDto: LogoutUserDto
  ): Promise<true>;
  token(userDto: UserDto, refreshJti: string): Promise<TokenDto>;
  validateUserAccessJti(userId: string, jti: string): Promise<UserDto>;
  validateUserRefreshJti(userId: string, jti: string): Promise<UserDto>;
}
