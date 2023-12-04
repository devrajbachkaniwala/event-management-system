import { EventPrice } from '@prisma/client';
import { CreateEventPriceDto, UpdateEventPriceDto } from '../../events';

export const eventPriceDaoToken = Symbol('eventPriceDaoToken');
export interface IEventPriceDao {
  create(
    orgId: string,
    eventId: string,
    createEventPriceDto: CreateEventPriceDto
  ): Promise<EventPrice>;

  findAll(eventId: string): Promise<EventPrice[]>;

  findOne(eventId: string, priceId: string): Promise<EventPrice>;

  update(
    orgId: string,
    eventId: string,
    priceId: string,
    updateEventPriceDto: UpdateEventPriceDto & { sold?: number }
  ): Promise<EventPrice>;

  remove(orgId: string, eventId: string, priceId: string): Promise<boolean>;
}
