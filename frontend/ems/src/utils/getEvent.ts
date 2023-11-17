import { DateService } from '@/services/date-service';
import { EventsService } from '@/services/events-service';

export const getEvent = async (id: string) => {
  try {
    const event = await EventsService.getOne(id);

    event.timings = event.timings.map((t) => ({
      ...t,
      date: DateService.getDateString(new Date(t.date), 'yyyy-MM-dd')
    }));
    return event;
  } catch (err: any) {
    console.log(err);
  }
};
