import { UpdateEventDto } from '@/dto/update-event.dto';
import { EventsService } from '@/services/events-service';

export const updateEvent = async (
  eventId: string,
  updateEvent: UpdateEventDto,
  photoFiles: Array<File | undefined>
) => {
  try {
    const event = await EventsService.update(eventId, updateEvent, photoFiles);

    return event;
  } catch (err: any) {
    console.log(err);
  }
};
