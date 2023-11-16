import { EventsService } from '@/services/events-service';

export const getAllEvents = async () => {
  try {
    const events = await EventsService.getAll();
    return events.splice(0, 6);
  } catch (err: any) {
    console.log(err);
  }
};
