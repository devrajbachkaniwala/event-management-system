import { CreateEventDto, EventDto, UpdateEventDto } from '../dto';

export const eventsServiceToken = Symbol('eventsServiceToken');
export interface IEventsService {
  create(orgId: string, createEventDto: CreateEventDto): Promise<EventDto>;
  findAll(): Promise<EventDto[]>;
  findOne(eventId: string): Promise<EventDto>;
  update(
    orgId: string,
    eventId: string,
    updateEventDto: UpdateEventDto
  ): Promise<EventDto>;
  remove(orgId: string, eventId: string): Promise<true>;
}
