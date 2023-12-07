import { Booking } from '@prisma/client';
import { CreateBookingDto } from '../../bookings';

export type TBookingInclude = {
  organization?: boolean;
  event?: boolean;
};

export const bookingDaoToken = Symbol('bookingDaoToken');
export interface IBookingDao {
  create(userId: string, createBookingDto: CreateBookingDto): Promise<Booking>;

  findAll(userId: string, include: TBookingInclude): Promise<Booking[]>;

  findOne(
    userId: string,
    bookingId: string,
    include: TBookingInclude
  ): Promise<Booking>;

  cancelBooking(userId: string, bookingId: string): Promise<boolean>;
}
