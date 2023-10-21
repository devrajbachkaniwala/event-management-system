import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Roles } from 'src/app/decorators';
import { UserDto } from 'src/app/dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const reqUser: { user: UserDto } = req.user as { user: UserDto };

    return this.validateUserRole(reqUser.user, roles);
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
