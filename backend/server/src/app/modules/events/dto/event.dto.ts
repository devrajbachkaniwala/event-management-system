import { Event, Organization } from '@prisma/client';
import { EventPhotoDto, EventPriceDto, EventTimingDto } from '../modules';
import { OrganizationDto } from '../../organization';

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
  photos: EventPhotoDto[];
  timings: EventTimingDto[];
  prices: EventPriceDto[];
  organization?: OrganizationDto;
}

export class EventDtoFactory {
  static create(event: Event & { organization?: Organization }): EventDto {
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
    eventDto.organization = event.organization;

    return eventDto;
  }
}
