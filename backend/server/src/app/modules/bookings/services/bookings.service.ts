import { Inject, Injectable } from '@nestjs/common';
import {
  BookingDto,
  BookingDtoFactory,
  BookingInclude,
  CreateBookingDto,
  TBookingInclude
} from '../dto';
import { IBookingsService } from './bookings-service.interface';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';
import { BookingError, BookingErrorFactory } from '../errors';
import {
  EventDtoFactory,
  EventPriceDtoFactory,
  EventTimingDtoFactory
} from '../../events';
import { Booking, BookingStatus } from '@prisma/client';
import { OrganizationDtoFactory } from '../../organization';

@Injectable()
export class BookingsService implements IBookingsService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    userId: string,
    createBookingDto: CreateBookingDto
  ): Promise<BookingDto> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: createBookingDto.eventId
        }
      });

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

      const booking = await this.prisma.booking.create({
        data: {
          qty: createBookingDto.qty,

          user: {
            connect: {
              id: userId
            }
          },

          event: {
            connect: {
              id: createBookingDto.eventId
            }
          },

          organization: {
            connect: {
              id: createBookingDto.orgId
            }
          },

          timingId: createBookingDto.timingId,
          priceId: createBookingDto.priceId
        }
      });

      const updateEvent = await this.prisma.event.update({
        where: {
          id: createBookingDto.eventId
        },
        data: {
          prices: {
            updateMany: {
              where: {
                id: createBookingDto.priceId
              },
              data: {
                sold: eventPrice.sold + createBookingDto.qty
              }
            }
          }
        }
      });

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

      const bookings = await this.prisma.booking.findMany({
        where: {
          user: {
            id: userId
          }
        },
        include: {
          organization: includeKeyVal.organization,
          event: includeEvent
        }
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

      const booking = await this.prisma.booking.findUnique({
        where: {
          id: bookingId,
          user: {
            id: userId
          }
        },
        include: {
          organization: includeKeyVal.organization,
          event: includeEvent
        }
      });

      return this.makeBookingDtoWithInclude(booking, includeKeyVal);
    } catch (err: any) {
      console.log(err);
      throw BookingErrorFactory.create(err, 'Failed to get booking');
    }
  }

  async cancelBooking(userId: string, bookingId: string): Promise<true> {
    try {
      const booking = await this.prisma.booking.update({
        where: {
          id: bookingId,
          user: {
            id: userId
          }
        },
        data: {
          status: BookingStatus.CANCEL
        }
      });

      const updateEvent = await this.prisma.event.update({
        where: {
          id: booking.eventId
        },
        data: {
          prices: {
            updateMany: {
              where: {
                id: booking.priceId
              },
              data: {
                sold: {
                  decrement: booking.qty
                }
              }
            }
          }
        }
      });

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
