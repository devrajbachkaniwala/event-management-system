import { Event, EventPhoto, EventPrice, EventTiming } from '@prisma/client';

export class EventDto {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  country: string;
  venue: string;
  category: string;
  createdAt: Date;
  modifiedAt: Date;
  orgId: string;
  photos: EventPhoto[];
  timings: EventTiming[];
  prices: EventPrice[];
}

export class EventDtoFactory {
  static create(event: Event): EventDto {
    const eventDto: EventDto = new EventDto();

    eventDto.id = event.id;
    eventDto.name = event.name;
    eventDto.description = event.description;
    eventDto.city = event.city;
    eventDto.state = event.state;
    eventDto.country = event.country;
    eventDto.venue = event.venue;
    eventDto.category = event.category;
    eventDto.createdAt = event.createdAt;
    eventDto.modifiedAt = event.modifiedAt;
    eventDto.orgId = event.orgId;
    eventDto.photos = event.photos;
    eventDto.timings = event.timings;
    eventDto.prices = event.prices;

    return eventDto;
  }
}
