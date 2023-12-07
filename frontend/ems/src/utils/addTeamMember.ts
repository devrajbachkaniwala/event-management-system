import { OrgService } from '@/services/org-service';

export const addTeamMember = async (teamMemberEmail: string) => {
  try {
    const user = await OrgService.addTeamMember(teamMemberEmail);

    return user;
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};
