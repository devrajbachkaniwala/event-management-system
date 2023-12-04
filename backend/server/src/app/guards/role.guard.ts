import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Roles } from 'src/app/decorators';
import { UserDto, UserDtoFactory } from 'src/app/dto';
import {
  IDaoFactory,
  daoFactoryToken
} from '../modules/dao/dao-factory/dao-factory.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(daoFactoryToken) private daoFactory: IDaoFactory
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const reqUser: { user: UserDto } = req.user as { user: UserDto };

    const user = await this.daoFactory.getUserDao().findById(reqUser.user.id);

    if (!user) {
      return false;
    }

    reqUser.user = UserDtoFactory.create(user);

    return this.validateUserRole(user, roles);
  }

  private validateUserRole(userDto: UserDto, roles: Role[]): boolean {
    if (roles.includes(Role.USER) && userDto.role === Role.USER) {
      return true;
    } else if (
      roles.includes(Role.ORGANIZATION_CREATOR) &&
      userDto.role === Role.ORGANIZATION_CREATOR
    ) {
      return true;
    } else if (
      roles.includes(Role.TEAM_MEMBER) &&
      (userDto.role === Role.TEAM_MEMBER ||
        userDto.role === Role.ORGANIZATION_CREATOR)
    ) {
      return true;
    } else if (roles.includes(Role.ADMIN) && userDto.role === Role.ADMIN) {
      return true;
    } else {
      return false;
    }
  }
}
