import { UpdateOrganizationDto } from '@/dto/update-organization.dto';
import { OrgService } from '@/services/org-service';

export const editOrg = async (
  updateOrgDto: UpdateOrganizationDto,
  photoFile: File | undefined
) => {
  try {
    const org = await OrgService.edit(updateOrgDto, photoFile);

    return org;
  } catch (err: any) {
    console.log(err);
  }
};
