import { Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto, TokenDto } from './dto';
import { PrismaService } from '../prisma';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  UserEmailAlreadyExists,
  AuthError,
  UserNotFound,
  InvalidPassword,
  InvalidToken
} from './errors';
import { UserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService
  ) {}

  async register(userDto: RegisterUserDto): Promise<UserDto> {
    try {
      const userEmailExist = await this.prisma.user.findUnique({
        where: {
          email: userDto.email
        }
      });

      if (userEmailExist) {
        throw new UserEmailAlreadyExists();
      }

      const isAdmin = userDto.email.endsWith('@admin.com');

      const hashPassword = await bcrypt.hash(userDto.password, 10);
      userDto.password = hashPassword;

      const user: UserDto = await this.prisma.user.create({
        data: {
          fullName: userDto.fullName,
          username: userDto.username,
          email: userDto.email,
          password: userDto.password,
          role: isAdmin ? Role.ADMIN : undefined
        },
        select: {
          id: true,
          fullName: true,
          username: true,
          userPhotoUrl: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          modifiedAt: true
        }
      });

      return user;
    } catch (err: any) {
      throw AuthError.create(err, 'Failed to register user');
    }
  }

  async login(userDto: LoginUserDto): Promise<TokenDto> {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          email: userDto.email
        }
      });

      if (!userExists) {
        throw new UserNotFound();
      }

      const isPasswordValid = await bcrypt.compare(
        userDto.password,
        userExists.password
      );

      if (!isPasswordValid) {
        throw new InvalidPassword();
      }

      const accessJti = v4();
      // 2 hour
      const accessTokenExpiredAt = Date.now() + 1000 * 60 * 60 * 2;

      const refreshJti = v4();
      // 2 days
      const refreshTokenExpiredAt = Date.now() + 1000 * 60 * 60 * 24 * 2;

      const userToken = await this.prisma.userToken.create({
        data: {
          accessToken: accessJti,
          refreshToken: refreshJti,
          accessTokenExpiredAt: new Date(accessTokenExpiredAt),
          refreshTokenExpiredAt: new Date(refreshTokenExpiredAt),
          userId: userExists.id
        }
      });

      const payload = {
        user: UserDto.create(userExists)
      };

      const accessToken = this.tokenService.generateAccess(payload, {
        jwtid: accessJti,
        expiresIn: '2h'
      });

      const refreshToken = this.tokenService.generateRefresh(payload, {
        jwtid: refreshJti,
        expiresIn: '2d'
      });

      return TokenDto.create({ accessToken, refreshToken });
    } catch (err: any) {
      console.log(err);
    }
  }

  async logout(user: UserDto, accessJti: string): Promise<boolean> {
    try {
      const userTokenExists = await this.prisma.userToken.findFirst({
        where: {
          accessToken: accessJti,
          userId: user.id,
          accessTokenExpiredAt: {
            gt: new Date()
          },
          refreshTokenExpiredAt: {
            gt: new Date()
          }
        }
      });

      if (!userTokenExists) {
        throw new InvalidToken();
      }

      const userToken = await this.prisma.userToken.update({
        where: {
          id: userTokenExists.id,
          userId: user.id,
          accessToken: accessJti
        },
        data: {
          accessTokenExpiredAt: new Date(0),
          refreshTokenExpiredAt: new Date(0)
        }
      });

      return true;
    } catch (err: any) {
      console.log(err);
      throw AuthError.create(err, 'Failed to logout user');
    }
  }

  async token(
    user: UserDto,
    refreshJti: string
  ): Promise<Omit<TokenDto, 'refreshToken'>> {
    try {
      const userTokenExists = await this.prisma.userToken.findFirst({
        where: {
          refreshToken: refreshJti,
          userId: user.id,
          refreshTokenExpiredAt: {
            gt: new Date()
          }
        }
      });

      if (!userTokenExists) {
        throw new InvalidToken();
      }

      const accessJti = v4();
      // 2 hour
      const accessTokenExpiredAt = Date.now() + 1000 * 60 * 60 * 2;

      const userToken = await this.prisma.userToken.update({
        where: {
          id: userTokenExists.id,
          userId: user.id,
          refreshToken: refreshJti
        },
        data: {
          accessToken: accessJti,
          accessTokenExpiredAt: new Date(accessTokenExpiredAt)
        }
      });

      const payload = {
        user
      };

      const accessToken = this.tokenService.generateAccess(payload, {
        jwtid: accessJti,
        expiresIn: '2h'
      });

      return { accessToken };
    } catch (err: any) {
      console.log(err);
      throw AuthError.create(err, 'Failed to logout user');
    }
  }
}
