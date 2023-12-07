import { Inject, Injectable } from '@nestjs/common';
import { ITeamMembersService } from './team-members-service.interface';
import { UserDto, UserDtoFactory } from 'src/app/dto';
import { OrganizationError, OrganizationErrorFactory } from '../../../errors';
import { Role } from '@prisma/client';
import { IOrganizationDao } from 'src/app/modules/dao/organization-dao/organization-dao.interface';
import {
  IDaoFactory,
  daoFactoryToken
} from 'src/app/modules/dao/dao-factory/dao-factory.interface';
import { IUserDao } from 'src/app/modules/dao/user-dao/user-dao.interface';

@Injectable()
export class TeamMembersService implements ITeamMembersService {
  private organizationDao: IOrganizationDao;
  private userDao: IUserDao;

  constructor(@Inject(daoFactoryToken) daoFactory: IDaoFactory) {
    this.organizationDao = daoFactory.getOrganizationDao();
    this.userDao = daoFactory.getUserDao();
  }

  async addTeamMember(
    orgId: string,
    teamMemberEmail: string
  ): Promise<UserDto> {
    try {
      const teamMemberExists = await this.userDao.findByEmail(teamMemberEmail);

      if (!teamMemberExists) {
        throw new OrganizationError('User is not registered');
      }

      if (teamMemberExists.orgId) {
        throw new OrganizationError(
          'User is already a part of current or another organization'
        );
      }

      const user = await this.organizationDao.addTeamMember(
        orgId,
        teamMemberEmail
      );

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

      const user = await this.organizationDao.removeTeamMember(teamMemberId);

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
      const teamMembers = await this.organizationDao.findAllTeamMembers(orgId);

      const users = teamMembers.map(UserDtoFactory.create);

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
