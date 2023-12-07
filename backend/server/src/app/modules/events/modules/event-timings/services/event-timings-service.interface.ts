import {
  CreateEventTimingDto,
  EventTimingDto,
  UpdateEventTimingDto
} from '../dto';

export const eventTimingsServiceToken = Symbol('eventTimingsServiceToken');
export interface IEventTimingsService {
  create(
    orgId: string,
    eventId: string,
    createEventTimingDto: CreateEventTimingDto
  ): Promise<EventTimingDto>;
  findAll(eventId: string): Promise<EventTimingDto[]>;
  findOne(eventId: string, timingId: string): Promise<EventTimingDto>;
  update(
    orgId: string,
    eventId: string,
    timingId: string,
    updateEventTimingDto: UpdateEventTimingDto
  ): Promise<EventTimingDto>;
  remove(orgId: string, eventId: string, timingId: string): Promise<boolean>;
}
