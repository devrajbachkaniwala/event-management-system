import { Organization } from '@prisma/client';

export class OrganizationDto {
  id: string;
  name: string;
  description: string;
  contactNo: string;
  email: string;
  photoUrl: string;
  createdAt: Date;
  modifiedAt: Date;
}

export class OrganizationDtoFactory {
  static create(org: Organization): OrganizationDto {
    const orgDto = new OrganizationDto();

    orgDto.id = org.id;
    orgDto.name = org.name;
    orgDto.description = org.description;
    orgDto.contactNo = org.contactNo;
    orgDto.email = org.email;
    orgDto.photoUrl = org.photoUrl;
    orgDto.createdAt = org.createdAt;
    orgDto.modifiedAt = org.modifiedAt;

    return orgDto;
  }
}
