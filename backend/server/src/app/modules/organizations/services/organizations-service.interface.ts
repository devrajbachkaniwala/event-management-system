import {
  CreateOrganizationDto,
  OrganizationDto,
  UpdateOrganizationDto
} from '../dto';

export const organizationsServiceToken = Symbol('organizationsServiceToken');
export interface IOrganizationsService {
  create(
    userId: string,
    createOrganizationDto: CreateOrganizationDto
  ): Promise<OrganizationDto>;
  findAll(): unknown;
  findOne(orgId: string): Promise<OrganizationDto>;
  update(
    orgId: string,
    updateOrganizationDto: UpdateOrganizationDto
  ): Promise<OrganizationDto>;
  remove(userId: string, orgId: string): Promise<true>;
}
