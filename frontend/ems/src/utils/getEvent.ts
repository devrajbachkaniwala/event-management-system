import { EventsService } from '@/services/events-service';

export const getEvent = async (id: string) => {
  try {
    const event = await EventsService.getOne(id);
    return event;
  } catch (err: any) {
    console.log(err);
  }
};
