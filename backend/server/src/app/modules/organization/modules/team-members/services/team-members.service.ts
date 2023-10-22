import { Inject, Injectable } from '@nestjs/common';
import { ITeamMembersService } from './team-members-service.interface';
import { UserDto, UserDtoFactory } from 'src/app/dto';
import {
  IPrismaApiService,
  prismaApiServiceToken
} from 'src/app/modules/prisma';
import { OrganizationError, OrganizationErrorFactory } from '../../../errors';
import { Role } from '@prisma/client';

@Injectable()
export class TeamMembersService implements ITeamMembersService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async addTeamMember(
    orgId: string,
    teamMemberEmail: string
  ): Promise<UserDto> {
    try {
      const teamMemberExists = await this.prisma.user.findUnique({
        where: {
          email: teamMemberEmail
        },
        include: {
          organization: true
        }
      });

      if (!teamMemberExists) {
        throw new OrganizationError('User is not registered');
      }

      if (teamMemberExists.organization) {
        throw new OrganizationError(
          'User is already a part of current or another organization'
        );
      }

      const user = await this.prisma.user.update({
        where: {
          email: teamMemberEmail
        },
        data: {
          role: Role.TEAM_MEMBER,

          organization: {
            connect: {
              id: orgId
            }
          }
        }
      });

      return UserDtoFactory.create(user);
    } catch (err: any) {
      console.log(err);
      throw OrganizationErrorFactory.create(err, 'Failed to add team member');
    }
  }

  async removeTeamMember(
    userDto: UserDto,
    teamMemberId: string
  ): Promise<true> {
    try {
      if (
        userDto.role === Role.ORGANIZATION_CREATOR &&
        userDto.id === teamMemberId
      ) {
        throw new OrganizationError(
          'Organization creator user cannot remove themselves from the organization'
        );
      }

      const user = await this.prisma.user.update({
        where: {
          id: teamMemberId
        },
        data: {
          role: Role.USER,

          organization: {
            disconnect: true
          }
        }
      });

      return true;
    } catch (err: any) {
      console.log(err);
      throw OrganizationErrorFactory.create(
        err,
        'Failed to remove team member'
      );
    }
  }

  async findAllTeamMembers(orgId: string): Promise<UserDto[]> {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: {
          id: orgId
        },
        include: {
          teamMembers: true
        }
      });

      const users = organization.teamMembers.map(UserDtoFactory.create);

      return users;
    } catch (err: any) {
      console.log(err);
      throw OrganizationErrorFactory.create(
        err,
        'Failed to get all team members'
      );
    }
  }
}
