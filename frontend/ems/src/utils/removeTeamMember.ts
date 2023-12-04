import { OrgService } from '@/services/org-service';

export const removeTeamMember = async (teamMemberId: string) => {
  try {
    const res = await OrgService.removeTeamMember(teamMemberId);

    return res;
  } catch (err: any) {
    console.log(err);
  }
};
