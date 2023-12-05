import { EventsService } from '@/services/events-service';

export const deleteEvent = async (eventId: string) => {
  try {
    const res = await EventsService.delete(eventId);

    return res;
  } catch (err: any) {
    console.log(err);
  }
};
