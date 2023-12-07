import { OrgService } from '@/services/org-service';

export const getOrg = async () => {
  try {
    const org = await OrgService.get();

    return org;
  } catch (err: any) {
    console.log(err);
  }
};
