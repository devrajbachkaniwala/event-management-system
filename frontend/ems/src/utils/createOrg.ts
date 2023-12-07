import { CreateOrganizationDto } from '@/dto/create-organization.dto';
import { OrgService } from '@/services/org-service';

export const createOrg = async (
  createOrgDto: CreateOrganizationDto,
  photoFile: File
) => {
  try {
    const org = await OrgService.create(createOrgDto, photoFile);

    return org;
  } catch (err: any) {
    console.log(err);
  }
};
