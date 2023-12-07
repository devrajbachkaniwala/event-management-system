import { Inject, Injectable } from '@nestjs/common';
import {
  BookingDto,
  BookingDtoFactory,
  BookingInclude,
  CreateBookingDto,
  TBookingInclude
} from '../dto';
import { IBookingsService } from './bookings-service.interface';
import { BookingError, BookingErrorFactory } from '../errors';
import {
  EventDtoFactory,
  EventPriceDtoFactory,
  EventTimingDtoFactory
} from '../../events';
import { Booking } from '@prisma/client';
import { OrganizationDtoFactory } from '../../organization';
import { IEventDao } from '../../dao/event-dao/event-dao.interface';
import { IEventPriceDao } from '../../dao/event-price-dao/event-price-dao.interface';
import { IBookingDao } from '../../dao/booking-dao/booking-dao.interface';
import {
  IDaoFactory,
  daoFactoryToken
} from '../../dao/dao-factory/dao-factory.interface';

@Injectable()
export class BookingsService implements IBookingsService {
  private eventDao: IEventDao;
  private eventPriceDao: IEventPriceDao;
  private bookingDao: IBookingDao;

  constructor(@Inject(daoFactoryToken) daoFactory: IDaoFactory) {
    this.eventDao = daoFactory.getEventDao();
    this.eventPriceDao = daoFactory.getEventPriceDao();
    this.bookingDao = daoFactory.getBookingDao();
  }

  async create(
    userId: string,
    createBookingDto: CreateBookingDto
  ): Promise<BookingDto> {
    try {
      const event = await this.eventDao.findOne(createBookingDto.eventId);

      if (!event) {
        throw new BookingError('Event not found');
      }

      const eventTiming = event.timings.find(
        (t) => t.id === createBookingDto.timingId
      );

      if (!eventTiming) {
        throw new BookingError('Event at that timing not found');
      }

      const eventPrice = event.prices.find(
        (p) => p.id === createBookingDto.priceId
      );

      if (!eventPrice) {
        throw new BookingError('Event at that price not found');
      }

      if (eventPrice.maxLimit !== 0) {
        if (eventPrice.sold === eventPrice.maxLimit) {
          throw new BookingError('Booking is full');
        } else if (
          eventPrice.sold + createBookingDto.qty >
          eventPrice.maxLimit
        ) {
          throw new BookingError(
            'Booking has less slots available than the quantity'
          );
        }
      }

      const booking = await this.bookingDao.create(userId, createBookingDto);

      const updateEvent = await this.eventPriceDao.update(
        booking.orgId,
        booking.eventId,
        booking.priceId,
        { sold: eventPrice.sold + createBookingDto.qty }
      );

      return BookingDtoFactory.create(booking);
    } catch (err: any) {
      throw BookingErrorFactory.create(err, 'Failed to create booking');
    }
  }

  async findAll(
    userId: string,
    includeValues: string[] = []
  ): Promise<BookingDto[]> {
    try {
      const includeKeyVal: Partial<Record<BookingInclude, boolean>> = {};

      includeValues.forEach((item) => {
        includeKeyVal[item] = true;
      });

      const includeEvent =
        includeKeyVal.price || includeKeyVal.timing || includeKeyVal.event;

      const bookings = await this.bookingDao.findAll(userId, {
        organization: includeKeyVal.organization,
        event: includeEvent
      });

      return bookings.map((b) =>
        this.makeBookingDtoWithInclude(b, includeKeyVal)
      );
    } catch (err: any) {
      console.log(err);
      throw BookingErrorFactory.create(
        err,
        `Failed to get all user's bookings`
      );
    }
  }

  async findOne(
    userId: string,
    bookingId: string,
    includeValues: string[] = []
  ): Promise<BookingDto> {
    try {
      const includeKeyVal: Partial<Record<BookingInclude, boolean>> = {};

      includeValues.forEach((item) => {
        includeKeyVal[item] = true;
      });

      const includeEvent =
        includeKeyVal.price || includeKeyVal.timing || includeKeyVal.event;

      const booking = await this.bookingDao.findOne(userId, bookingId, {
        organization: includeKeyVal.organization,
        event: includeEvent
      });

      return this.makeBookingDtoWithInclude(booking, includeKeyVal);
    } catch (err: any) {
      console.log(err);
      throw BookingErrorFactory.create(err, 'Failed to get booking');
    }
  }

  async cancelBooking(userId: string, bookingId: string): Promise<true> {
    try {
      const isBookingCancelled = await this.bookingDao.cancelBooking(
        userId,
        bookingId
      );

      const booking = await this.bookingDao.findOne(userId, bookingId, {
        event: true
      });

      const eventPrice = await this.eventPriceDao.findOne(
        booking.eventId,
        booking.priceId
      );

      const updateEventPrice = await this.eventPriceDao.update(
        booking.orgId,
        booking.eventId,
        booking.priceId,
        { sold: eventPrice.sold - booking.qty }
      );

      return true;
    } catch (err: any) {
      throw BookingErrorFactory.create(err, 'Failed to cancel booking');
    }
  }

  // update(id: number, updateBookingDto: UpdateBookingDto) {
  //   return `This action updates a #${id} booking`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} booking`;
  // }

  private makeBookingDtoWithInclude(
    booking: Booking & TBookingInclude,
    includeValues: Partial<Record<BookingInclude, boolean>>
  ): BookingDto {
    const data: BookingDto = { ...booking };

    if (includeValues.price) {
      data.price = booking.event.prices.find((p) => p.id === booking.priceId);

      if (data.price) {
        data.price = EventPriceDtoFactory.create(data.price);
      }
    }

    if (includeValues.timing) {
      data.timing = booking.event.timings.find(
        (t) => t.id === booking.timingId
      );

      if (data.timing) {
        data.timing = EventTimingDtoFactory.create(data.timing);
      }
    }

    if (!includeValues.event) {
      data.event = undefined;
    } else {
      data.event = EventDtoFactory.create(data.event);
    }

    if (includeValues.organization) {
      data.organization = OrganizationDtoFactory.create(data.organization);
    }

    return BookingDtoFactory.create(data);
  }
}
