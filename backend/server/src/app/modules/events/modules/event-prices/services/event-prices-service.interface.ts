import {
  CreateEventPriceDto,
  EventPriceDto,
  UpdateEventPriceDto
} from '../dto';

export const eventPricesServiceToken = Symbol('eventPricesServiceToken');
export interface IEventPricesService {
  create(
    orgId: string,
    eventId: string,
    createEventPriceDto: CreateEventPriceDto
  ): Promise<EventPriceDto>;
  findAll(eventId: string): Promise<EventPriceDto[]>;
  findOne(eventId: string, priceId: string): Promise<EventPriceDto>;
  update(
    orgId: string,
    eventId: string,
    priceId: string,
    updateEventPriceDto: UpdateEventPriceDto
  ): Promise<EventPriceDto>;
  remove(orgId: string, eventId: string, priceId: string): Promise<true>;
}
