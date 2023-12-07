import { OrgService } from '@/services/org-service';

export const getOrgTeamMembers = async () => {
  try {
    const teamMembers = await OrgService.getTeamMembers();

    return teamMembers;
  } catch (err: any) {
    console.log(err);
  }
};
