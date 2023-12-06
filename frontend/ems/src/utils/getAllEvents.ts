import { EventsService } from '@/services/events-service';

export const getAllEvents = async () => {
  try {
    const events = await EventsService.getAll();
    return events;
  } catch (err: any) {
    console.log(err);
  }
};
