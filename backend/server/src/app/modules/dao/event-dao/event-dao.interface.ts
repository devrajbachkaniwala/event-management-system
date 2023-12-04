import { Event } from '@prisma/client';
import { CreateEventDto, UpdateEventDto } from '../../events';

export type TEventPhotos = {
  photoUrls: string[];
};

export const eventDaoToken = Symbol('eventDaoToken');
export interface IEventDao {
  create(orgId: string, createEventDto: CreateEventDto): Promise<Event>;

  findAll(): Promise<Event[]>;

  findOne(eventId: string): Promise<Event>;

  update(
    orgId: string,
    eventId: string,
    updateEventDto: UpdateEventDto & Partial<TEventPhotos>
  ): Promise<Event>;

  remove(orgId: string, eventId: string): Promise<boolean>;
}
