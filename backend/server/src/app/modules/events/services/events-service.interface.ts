import { CreateEventDto, EventDto, UpdateEventDto } from '../dto';

export const eventsServiceToken = Symbol('eventsServiceToken');
export interface IEventsService {
  create(
    orgId: string,
    createEventDto: CreateEventDto,
    eventPhotoFiles: Array<Express.Multer.File>
  ): Promise<EventDto>;

  findAll(): Promise<EventDto[]>;

  findOne(eventId: string): Promise<EventDto>;

  update(
    orgId: string,
    eventId: string,
    updateEventDto: UpdateEventDto,
    eventPhotoFiles?: Array<Express.Multer.File>
  ): Promise<EventDto>;

  remove(orgId: string, eventId: string): Promise<boolean>;
}
