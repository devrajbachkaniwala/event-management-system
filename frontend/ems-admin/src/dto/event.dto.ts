import { EventPhotoDto } from './event-photo.dto';
import { EventPriceDto } from './event-price.dto';
import { EventTimingDto } from './event-timing.dto';
import { OrganizationDto } from './organization.dto';

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
