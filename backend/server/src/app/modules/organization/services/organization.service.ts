import { Inject, Injectable } from '@nestjs/common';
import {
  CreateOrganizationDto,
  OrganizationDto,
  OrganizationDtoFactory,
  UpdateOrganizationDto
} from '../dto';
import { OrganizationError, OrganizationErrorFactory } from '../errors';
import { Role } from '@prisma/client';
import { IOrganizationService } from './organization-service.interface';
import { ConfigService } from '@nestjs/config';
import { EventDto, EventDtoFactory } from '../../events';
import {
  IDaoFactory,
  daoFactoryToken
} from '../../dao/dao-factory/dao-factory.interface';
import { IOrganizationDao } from '../../dao/organization-dao/organization-dao.interface';
import { IUserDao } from '../../dao/user-dao/user-dao.interface';

@Injectable()
export class OrganizationService implements IOrganizationService {
  private organizationDao: IOrganizationDao;
  private userDao: IUserDao;

  constructor(
    @Inject(daoFactoryToken) daoFactory: IDaoFactory,
    private readonly configService: ConfigService
  ) {
    this.organizationDao = daoFactory.getOrganizationDao();
    this.userDao = daoFactory.getUserDao();
  }

  async create(
    userId: string,
    createOrganizationDto: CreateOrganizationDto,
    orgPhotoFile: Express.Multer.File
  ): Promise<OrganizationDto> {
    try {
      const photoUrl = orgPhotoFile
        ? this.generatePhotoUrl(orgPhotoFile.filename)
        : undefined;

      const organization = await this.organizationDao.create(userId, {
        ...createOrganizationDto,
        photoUrl
      });

      const user = await this.userDao.update(userId, {
        role: Role.ORGANIZATION_CREATOR
      });

      return OrganizationDtoFactory.create(organization);
    } catch (err: any) {
      console.log(err);
      throw OrganizationErrorFactory.create(
        err,
        'Failed to create an organization'
      );
    }
  }

  async findOne(userId: string, orgId: string): Promise<OrganizationDto> {
    try {
      const organization = await this.organizationDao.findOne(userId, orgId);

      if (!organization) {
        throw new OrganizationError('User is not a part of an organization');
      }

      return OrganizationDtoFactory.create(organization);
    } catch (err: any) {
      console.log(err);
      throw OrganizationErrorFactory.create(
        err,
        'Failed to get an organization'
      );
    }
  }

  async getOrgEvents(orgId: string): Promise<EventDto[]> {
    try {
      const events = await this.organizationDao.getOrgEvents(orgId);

      return events.map(EventDtoFactory.create);
    } catch (err: any) {
      console.log(err);
      throw OrganizationErrorFactory.create(
        err,
        'Failed to get an organization events'
      );
    }
  }

  async update(
    userId: string,
    orgId: string,
    updateOrganizationDto: UpdateOrganizationDto,
    orgPhotoFile: Express.Multer.File
  ): Promise<OrganizationDto> {
    try {
      const photoUrl = orgPhotoFile
        ? this.generatePhotoUrl(orgPhotoFile.filename)
        : undefined;

      const organization = await this.organizationDao.update(userId, orgId, {
        ...updateOrganizationDto,
        photoUrl
      });

      if (!organization) {
        throw new OrganizationError('User is not a part of an organization');
      }

      return OrganizationDtoFactory.create(organization);
    } catch (err: any) {
      console.log(err);
      throw OrganizationErrorFactory.create(
        err,
        'Failed to update an organization'
      );
    }
  }

  async remove(userId: string, orgId: string): Promise<true> {
    try {
      const organization = await this.organizationDao.remove(userId, orgId);

      const user = await this.userDao.update(userId, { role: Role.USER });

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
