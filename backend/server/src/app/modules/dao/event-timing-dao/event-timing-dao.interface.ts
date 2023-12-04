import { EventTiming } from '@prisma/client';
import { CreateEventTimingDto, UpdateEventTimingDto } from '../../events';

export const eventTimingDaoToken = Symbol('eventTimingDaoToken');
export interface IEventTimingDao {
  create(
    orgId: string,
    eventId: string,
    createEventTimingDto: CreateEventTimingDto
  ): Promise<EventTiming>;

  findAll(eventId: string): Promise<EventTiming[]>;

  findOne(eventId: string, timingId: string): Promise<EventTiming>;

  update(
    orgId: string,
    eventId: string,
    timingId: string,
    updateEventTimingDto: UpdateEventTimingDto
  ): Promise<EventTiming>;

  remove(orgId: string, eventId: string, timingId: string): Promise<boolean>;
}
