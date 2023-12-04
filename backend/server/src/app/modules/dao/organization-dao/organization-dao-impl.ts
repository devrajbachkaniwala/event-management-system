import { $Enums, Event, Organization, Role, User } from '@prisma/client';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto
} from '../../organization';
import { IOrganizationDao, TOrgPhotos } from './organization-dao.interface';
import { DaoError } from '../errors/dao.error';
import { Inject } from '@nestjs/common';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';

export class OrganizationDaoImpl implements IOrganizationDao {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    userId: string,
    createOrganizationDto: CreateOrganizationDto & TOrgPhotos
  ): Promise<Organization> {
    try {
      const organization = await this.prisma.organization.create({
        data: {
          teamMembers: {
            connect: {
              id: userId
            }
          },

          name: createOrganizationDto.name,
          description: createOrganizationDto.description,
          email: createOrganizationDto.email,
          contactNo: createOrganizationDto.contactNo,
          photoUrl: createOrganizationDto.photoUrl
        }
      });

      return organization;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findOne(userId: string, orgId: string): Promise<Organization> {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: {
          id: orgId
        },
        include: {
          teamMembers: {
            where: {
              id: userId
            }
          }
        }
      });

      return organization;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async getOrgEvents(orgId: string): Promise<Event[]> {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: {
          id: orgId
        },
        include: {
          events: true
        }
      });

      return organization.events;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async update(
    userId: string,
    orgId: string,
    updateOrganizationDto: UpdateOrganizationDto & Partial<TOrgPhotos>
  ): Promise<Organization> {
    try {
      const organization = await this.prisma.organization.update({
        where: {
          id: orgId
        },
        data: {
          name: updateOrganizationDto.name,
          description: updateOrganizationDto.description,
          email: updateOrganizationDto.email,
          contactNo: updateOrganizationDto.contactNo,
          photoUrl: updateOrganizationDto.photoUrl
        },
        include: {
          teamMembers: {
            where: {
              id: userId
            }
          }
        }
      });

      return organization;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async remove(userId: string, orgId: string): Promise<boolean> {
    try {
      const organization = await this.prisma.organization.delete({
        where: {
          id: orgId
        },
        include: {
          teamMembers: {
            where: {
              id: userId
            }
          }
        }
      });

      return true;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async addTeamMember(orgId: string, teamMemberEmail: string): Promise<User> {
    try {
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

      return user;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async removeTeamMember(userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId
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
      throw new DaoError(err.message);
    }
  }

  async findAllTeamMembers(orgId: string): Promise<User[]> {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: {
          id: orgId
        },
        include: {
          teamMembers: true
        }
      });

      return organization.teamMembers;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }
}
