import { EventPriceDto } from './event-price.dto';
import { EventTimingDto } from './event-timing.dto';
import { EventDto } from './event.dto';
import { OrganizationDto } from './organization.dto';

type BookingStatus = 'ACTIVE' | 'CANCEL';

export class BookingDto {
  id: string;
  qty: number;
  status: BookingStatus;
  createdAt: Date;
  modifiedAt: Date;

  userId: string;

  event?: EventDto;
  eventId: string;

  organization?: OrganizationDto;
  orgId: string;

  price?: EventPriceDto;
  priceId: string;

  timing?: EventTimingDto;
  timingId: string;
}
