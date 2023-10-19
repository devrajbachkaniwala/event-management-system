import { CreateOrganizationDto, UpdateOrganizationDto } from '../dto';

export const organizationsServiceToken = Symbol('organizationsServiceToken');
export interface IOrganizationsService {
  create(createOrganizationDto: CreateOrganizationDto): unknown;
  findAll(): unknown;
  findOne(arg0: number): unknown;
  update(arg0: number, updateOrganizationDto: UpdateOrganizationDto): unknown;
  remove(arg0: number): unknown;
}
