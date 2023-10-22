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

  findOne(userId: string): Promise<OrganizationDto>;

  update(
    userId: string,
    updateOrganizationDto: UpdateOrganizationDto,
    orgPhotoFile: Express.Multer.File
  ): Promise<OrganizationDto>;

  remove(userId: string): Promise<true>;
}
