import { OrgService } from '@/services/org-service';

export const getOrgEvents = async () => {
  try {
    const events = await OrgService.getOrgEvents();

    return events;
  } catch (err: any) {
    console.log(err);
  }
};
