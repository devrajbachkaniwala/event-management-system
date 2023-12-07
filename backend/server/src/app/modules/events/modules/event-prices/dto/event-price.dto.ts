import { EventPrice } from '@prisma/client';

export class EventPriceDto {
  id: string;
  price: number;
  currency: string;
  maxLimit: number;
  sold: number;
}

export class EventPriceDtoFactory {
  static create(eventPrice: EventPrice): EventPriceDto {
    const eventPriceDto: EventPriceDto = new EventPriceDto();

    eventPriceDto.id = eventPrice.id;
    eventPriceDto.price = eventPrice.price;
    eventPriceDto.currency = eventPrice.currency;
    eventPriceDto.maxLimit = eventPrice.maxLimit;
    eventPriceDto.sold = eventPrice.sold;

    return eventPriceDto;
  }
}
