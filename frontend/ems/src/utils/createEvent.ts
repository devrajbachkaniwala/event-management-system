import { CreateEventDto } from '@/dto/create-event.dto';
import { EventsService } from '@/services/events-service';

export const createEvent = async (
  createEvent: CreateEventDto,
  photoFiles: Array<File | undefined>
) => {
  try {
    const event = await EventsService.create(createEvent, photoFiles);

    return event;
  } catch (err: any) {
    console.log(err);
  }
};
