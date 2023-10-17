import { UserDto } from 'src/app/dto';
import { TokenDto, LoginUserDto, RegisterUserDto, TokensDto } from '../../dto';
import { LogoutUserDto } from '../../dto/logout-user.dto';

export const authServiceToken = Symbol('authServiceToken');
export interface IAuthService {
  register(registerUserDto: RegisterUserDto): Promise<UserDto>;
  login(loginUserDto: LoginUserDto): Promise<TokensDto>;
  logout(
    userId: string,
    accessJti: string,
    logoutUserDto: LogoutUserDto
  ): Promise<true>;
  token(userDto: UserDto, refreshJti: string): Promise<TokenDto>;
  validateAccessJti(userId: string, jti: string): Promise<boolean>;
  validateRefreshJti(userId: string, jti: string): Promise<boolean>;
}
