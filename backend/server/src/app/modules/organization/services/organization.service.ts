import { Inject, Injectable } from '@nestjs/common';
import {
  CreateOrganizationDto,
  OrganizationDto,
  OrganizationDtoFactory,
  UpdateOrganizationDto
} from '../dto';
import { OrganizationError, OrganizationErrorFactory } from '../errors';
import { Role } from '@prisma/client';
import {
  IPrismaApiService,
  prismaApiServiceToken
} from '../../prisma/services';
import { IOrganizationService } from './organization-service.interface';
import { ConfigService } from '@nestjs/config';
import { EventDto, EventDtoFactory } from '../../events';

@Injectable()
export class OrganizationService implements IOrganizationService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService,
    private readonly configService: ConfigService
  ) {}

  async create(
    userId: string,
    createOrganizationDto: CreateOrganizationDto,
    orgPhotoFile: Express.Multer.File
  ): Promise<OrganizationDto> {
    try {
      const photoUrl = orgPhotoFile
        ? this.generatePhotoUrl(orgPhotoFile.filename)
        : undefined;

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
              photoUrl: photoUrl
            }
          }
        },
        include: {
          organization: true
        }
      });

      return OrganizationDtoFactory.create(user.organization);
    } catch (err: any) {
      console.log(err);
      throw OrganizationErrorFactory.create(
        err,
        'Failed to create an organization'
      );
    }
  }

  async findOne(userId: string): Promise<OrganizationDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        },
        include: {
          organization: true
        }
      });

      if (!user.organization) {
        throw new OrganizationError('User is not a part of an organization');
      }

      return OrganizationDtoFactory.create(user.organization);
    } catch (err: any) {
      throw OrganizationErrorFactory.create(
        err,
        'Failed to get an organization'
      );
    }
  }

  async getOrgEvents(orgId: string): Promise<EventDto[]> {
    try {
      const events = await this.prisma.event.findMany({
        where: {
          organization: {
            id: orgId
          }
        }
      });

      return events.map(EventDtoFactory.create);
    } catch (err: any) {
      throw OrganizationErrorFactory.create(
        err,
        'Failed to get an organization events'
      );
    }
  }

  async update(
    userId: string,
    updateOrganizationDto: UpdateOrganizationDto,
    orgPhotoFile: Express.Multer.File
  ): Promise<OrganizationDto> {
    try {
      const photoUrl = orgPhotoFile
        ? this.generatePhotoUrl(orgPhotoFile.filename)
        : undefined;

      const user = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          organization: {
            update: {
              name: updateOrganizationDto.name,
              description: updateOrganizationDto.description,
              email: updateOrganizationDto.email,
              contactNo: updateOrganizationDto.contactNo,
              photoUrl: photoUrl
            }
          }
        },
        include: {
          organization: true
        }
      });

      if (!user.organization) {
        throw new OrganizationError('User is not a part of an organization');
      }

      return OrganizationDtoFactory.create(user.organization);
    } catch (err: any) {
      throw OrganizationErrorFactory.create(
        err,
        'Failed to update an organization'
      );
    }
  }

  async remove(userId: string): Promise<true> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId
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

  private generatePhotoUrl(filename: string): string {
    return `${this.configService.get(
      'SERVER_URL'
    )}/v1/organization/photos/${filename}`;
  }
}
