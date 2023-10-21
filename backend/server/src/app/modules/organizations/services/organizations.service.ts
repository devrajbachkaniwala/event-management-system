import { Inject, Injectable } from '@nestjs/common';
import {
  CreateOrganizationDto,
  OrganizationDto,
  OrganizationDtoFactory,
  UpdateOrganizationDto
} from '../dto';
import { OrganizationErrorFactory } from '../errors';
import { Role } from '@prisma/client';
import {
  IPrismaApiService,
  prismaApiServiceToken
} from '../../prisma/services';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    userId: string,
    createOrganizationDto: CreateOrganizationDto
  ): Promise<OrganizationDto> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          role: Role.ORGANIZATION_CREATOR,

          organization: {
            create: {
              name: createOrganizationDto.name,
              description: createOrganizationDto.description,
              email: createOrganizationDto.email,
              contactNo: createOrganizationDto.contactNo,
              photoUrl: ''
            }
          }
        },
        include: {
          organization: true
        }
      });

      return OrganizationDtoFactory.create(user.organization);
    } catch (err: any) {
      throw OrganizationErrorFactory.create(
        err,
        'Failed to create an organization'
      );
    }
  }

  findAll() {
    return `This action returns all organizations`;
  }

  async findOne(orgId: string): Promise<OrganizationDto> {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: {
          id: orgId
        }
      });

      return OrganizationDtoFactory.create(organization);
    } catch (err: any) {
      throw OrganizationErrorFactory.create(
        err,
        'Failed to get an organization'
      );
    }
  }

  async update(
    orgId: string,
    updateOrganizationDto: UpdateOrganizationDto
  ): Promise<OrganizationDto> {
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
          photoUrl: ''
        }
      });

      return OrganizationDtoFactory.create(organization);
    } catch (err: any) {
      throw OrganizationErrorFactory.create(
        err,
        'Failed to update an organization'
      );
    }
  }

  async remove(userId: string, orgId: string): Promise<true> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
          orgId: orgId
        },
        data: {
          role: Role.USER,

          organization: {
            delete: true
          }
        },
        include: {
          organization: true
        }
      });

      return true;
    } catch (err: any) {
      console.log(err);
      throw OrganizationErrorFactory.create(
        err,
        'Failed to remove an organization'
      );
    }
  }
}
