import { EventDto } from '../../events';
import {
  CreateOrganizationDto,
  OrganizationDto,
  UpdateOrganizationDto
} from '../dto';

export const organizationServiceToken = Symbol('organizationServiceToken');
export interface IOrganizationService {
  create(
    userId: string,
    createOrganizationDto: CreateOrganizationDto,
    orgPhotoFile: Express.Multer.File
  ): Promise<OrganizationDto>;

  findOne(userId: string, orgId: string): Promise<OrganizationDto>;

  getOrgEvents(orgId: string): Promise<EventDto[]>;

  update(
    userId: string,
    orgId: string,
    updateOrganizationDto: UpdateOrganizationDto,
    orgPhotoFile: Express.Multer.File
  ): Promise<OrganizationDto>;

  remove(userId: string, orgId: string): Promise<true>;
}
