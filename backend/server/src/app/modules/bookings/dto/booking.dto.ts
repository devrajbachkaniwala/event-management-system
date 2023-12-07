import { Booking, BookingStatus } from '@prisma/client';
import { EventDto, EventPriceDto, EventTimingDto } from '../../events';
import { OrganizationDto } from '../../organization';

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

export enum BookingInclude {
  EVENT = 'event',
  ORGANIZATION = 'organization',
  PRICE = 'price',
  TIMING = 'timing'
}

export type TBookingInclude = {
  event?: EventDto;
  organization?: OrganizationDto;
  price?: EventPriceDto;
  timing?: EventTimingDto;
};

export class BookingDtoFactory {
  static create(booking: Booking & TBookingInclude): BookingDto {
    const bookingDto: BookingDto = new BookingDto();

    bookingDto.id = booking.id;
    bookingDto.qty = booking.qty;
    bookingDto.status = booking.status;
    bookingDto.createdAt = booking.createdAt;
    bookingDto.modifiedAt = booking.modifiedAt;

    bookingDto.userId = booking.userId;

    bookingDto.event = booking?.event;
    bookingDto.eventId = booking.eventId;

    bookingDto.organization = booking?.organization;
    bookingDto.orgId = booking.orgId;

    bookingDto.price = booking?.price;
    bookingDto.priceId = booking.priceId;

    bookingDto.timing = booking?.timing;
    bookingDto.timingId = booking.timingId;

    return bookingDto;
  }
}
