import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth-service.interface';
import { IPrismaService, prismaServiceToken } from 'src/app/modules/prisma';
import { IJwtTokenService, jwtTokenServiceToken } from '../jwt-token';
import {
  LoginUserDto,
  LogoutUserDto,
  RegisterUserDto,
  TokenDto,
  TokenDtoFactory,
  TokensDto,
  TokensDtoFactory
} from '../../dto';
import {
  AuthErrorFactory,
  InvalidPassword,
  UserEmailAlreadyExists,
  UserNotFound
} from '../../errors';
import { Role, User, UserToken } from '@prisma/client';
import {
  IEncryptService,
  IUuidService,
  encryptServiceToken,
  uuidServiceToken
} from 'src/app/modules/shared';
import { UserDto, UserDtoFactory } from 'src/app/dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(prismaServiceToken) private readonly prisma: IPrismaService,
    @Inject(jwtTokenServiceToken)
    private readonly tokenService: IJwtTokenService,
    @Inject(uuidServiceToken) private readonly uuidService: IUuidService,
    @Inject(encryptServiceToken)
    private readonly encryptService: IEncryptService,
    private readonly configService: ConfigService
  ) {}

  async register(
    userDto: RegisterUserDto,
    userPhotoFile: Express.Multer.File
  ): Promise<UserDto> {
    try {
      const userEmailExist: User = await this.prisma.user.findUnique({
        where: {
          email: userDto.email
        }
      });

      if (userEmailExist) {
        throw new UserEmailAlreadyExists();
      }

      const photoUrl = userPhotoFile
        ? this.generatePhotoUrl(userPhotoFile.filename)
        : undefined;

      const isAdmin: boolean = userDto.email.endsWith('@admin.com');

      const hashPassword: string = await this.encryptService.hash(
        userDto.password,
        10
      );
      userDto.password = hashPassword;

      const user: User = await this.prisma.user.create({
        data: {
          fullName: userDto.fullName,
          username: userDto.username,
          email: userDto.email,
          password: userDto.password,
          role: isAdmin ? Role.ADMIN : undefined,
          userPhotoUrl: photoUrl
        }
      });

      return UserDtoFactory.create(user);
    } catch (err: any) {
      console.log(err);
      throw AuthErrorFactory.create(err, 'Failed to register user');
    }
  }

  async login(userDto: LoginUserDto): Promise<TokensDto> {
    try {
      const userExists: User = await this.prisma.user.findUnique({
        where: {
          email: userDto.email
        }
      });

      if (!userExists) {
        throw new UserNotFound();
      }

      const isPasswordValid = await this.encryptService.compare(
        userDto.password,
        userExists.password
      );

      if (!isPasswordValid) {
        throw new InvalidPassword();
      }

      const accessJti: string = this.uuidService.generate();
      // 2 hour
      const accessTokenExpiredAt: number = Date.now() + 1000 * 60 * 60 * 2;

      const refreshJti: string = this.uuidService.generate();
      // 2 days
      const refreshTokenExpiredAt: number =
        Date.now() + 1000 * 60 * 60 * 24 * 2;

      const userToken: UserToken = await this.prisma.userToken.create({
        data: {
          accessToken: accessJti,
          refreshToken: refreshJti,
          accessTokenExpiredAt: new Date(accessTokenExpiredAt),
          refreshTokenExpiredAt: new Date(refreshTokenExpiredAt),
          userId: userExists.id
        }
      });

      const payload = {
        user: UserDtoFactory.create(userExists)
      };

      const accessToken: string = this.tokenService.generateAccess(payload, {
        jwtid: accessJti,
        expiresIn: '2h'
      });

      const refreshToken: string = this.tokenService.generateRefresh(payload, {
        jwtid: refreshJti,
        expiresIn: '2d'
      });

      return TokensDtoFactory.create(accessToken, refreshToken);
    } catch (err: any) {
      console.log(err);
      throw AuthErrorFactory.create(err, 'Failed to login user');
    }
  }

  async logout(
    userId: string,
    accessJti: string,
    logoutUserDto: LogoutUserDto
  ): Promise<true> {
    try {
      if (logoutUserDto.allDevices) {
        // Logout all devices

        const userTokens = await this.prisma.userToken.updateMany({
          where: {
            userId
          },
          data: {
            accessTokenExpiredAt: new Date(0),
            refreshTokenExpiredAt: new Date(0)
          }
        });
      } else {
        // Logout particular device with accessJti

        const user = await this.prisma.user.update({
          where: {
            id: userId
          },
          data: {
            tokens: {
              updateMany: {
                where: {
                  accessToken: accessJti
                },
                data: {
                  accessTokenExpiredAt: new Date(0),
                  refreshTokenExpiredAt: new Date(0)
                }
              }
            }
          }
        });
      }

      return true;
    } catch (err: any) {
      console.log(err);
      throw AuthErrorFactory.create(err, 'Failed to logout user');
    }
  }

  async token(userDto: UserDto, refreshJti: string): Promise<TokenDto> {
    try {
      const accessJti: string = this.uuidService.generate();
      // 2 hour
      const accessTokenExpiredAt: number = Date.now() + 1000 * 60 * 60 * 2;

      const user = await this.prisma.user.update({
        where: {
          id: userDto.id
        },
        data: {
          tokens: {
            updateMany: {
              where: {
                refreshToken: refreshJti
              },
              data: {
                accessToken: accessJti,
                accessTokenExpiredAt: new Date(accessTokenExpiredAt)
              }
            }
          }
        }
      });

      const payload = {
        user: userDto
      };

      const accessToken: string = this.tokenService.generateAccess(payload, {
        jwtid: accessJti,
        expiresIn: '2h'
      });

      return TokenDtoFactory.create(accessToken);
    } catch (err: any) {
      console.log(err);
      throw AuthErrorFactory.create(err, 'Failed to get new access token');
    }
  }

  async validateAccessJti(userId: string, jti: string): Promise<boolean> {
    const userTokenExists = await this.prisma.user.findUnique({
      where: {
        id: userId,
        tokens: {
          some: {
            accessToken: jti,
            accessTokenExpiredAt: {
              gt: new Date()
            }
          }
        }
      }
    });

    return !!userTokenExists;
  }
  async validateRefreshJti(userId: string, jti: string): Promise<boolean> {
    const userTokenExists = await this.prisma.user.findUnique({
      where: {
        id: userId,
        tokens: {
          some: {
            refreshToken: jti,
            refreshTokenExpiredAt: {
              gt: new Date()
            }
          }
        }
      }
    });

    return !!userTokenExists;
  }

  private generatePhotoUrl(filename: string): string {
    return `${this.configService.get(
      'AUTH_SERVER_URL'
    )}/v1/account/user-photos/${filename}`;
  }
}
