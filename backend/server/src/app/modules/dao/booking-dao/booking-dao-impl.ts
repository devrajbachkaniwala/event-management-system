import { $Enums, Booking, BookingStatus } from '@prisma/client';
import { CreateBookingDto } from '../../bookings';
import { IBookingDao, TBookingInclude } from './booking-dao.interface';
import { Inject } from '@nestjs/common';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';
import { DaoError } from '../errors/dao.error';

export class BookingDaoImpl implements IBookingDao {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    userId: string,
    createBookingDto: CreateBookingDto
  ): Promise<Booking> {
    try {
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

      return booking;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findAll(userId: string, include: TBookingInclude): Promise<Booking[]> {
    try {
      const bookings = await this.prisma.booking.findMany({
        where: {
          user: {
            id: userId
          }
        },
        include: {
          organization: include.organization,
          event: include.event
        }
      });

      return bookings;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findOne(
    userId: string,
    bookingId: string,
    include: TBookingInclude
  ): Promise<Booking> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: {
          id: bookingId,
          user: {
            id: userId
          }
        },
        include: {
          organization: include.organization,
          event: include.event
        }
      });

      return booking;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async cancelBooking(userId: string, bookingId: string): Promise<boolean> {
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

      return true;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }
}
