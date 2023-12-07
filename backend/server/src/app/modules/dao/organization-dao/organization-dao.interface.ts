import { Event, Organization, User } from '@prisma/client';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto
} from '../../organization';

export type TOrgPhotos = {
  photoUrl: string;
};

export const organizationDaoToken = Symbol('organizationDaoToken');
export interface IOrganizationDao {
  create(
    userId: string,
    createOrganizationDto: CreateOrganizationDto & TOrgPhotos
  ): Promise<Organization>;

  findOne(userId: string, orgId: string): Promise<Organization>;

  getOrgEvents(orgId: string): Promise<Event[]>;

  update(
    userId: string,
    orgId: string,
    updateOrganizationDto: UpdateOrganizationDto & Partial<TOrgPhotos>
  ): Promise<Organization>;

  remove(userId: string, orgId: string): Promise<boolean>;

  addTeamMember(orgId: string, teamMemberEmail: string): Promise<User>;

  removeTeamMember(userId: string): Promise<boolean>;

  findAllTeamMembers(orgId: string): Promise<User[]>;
}
