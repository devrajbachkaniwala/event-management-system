import { BookingDto, CreateBookingDto } from '../dto';

export const bookingsServiceToken = Symbol('bookingsServiceToken');
export interface IBookingsService {
  create(
    userId: string,
    createBookingDto: CreateBookingDto
  ): Promise<BookingDto>;

  findAll(userId: string, includes: string[]): Promise<BookingDto[]>;

  findOne(
    userId: string,
    bookingId: string,
    includes: string[]
  ): Promise<BookingDto>;

  cancelBooking(userId: string, bookingId: string): Promise<true>;

  // update(arg0: number, updateBookingDto: UpdateBookingDto): unknown;
  // remove(arg0: number): unknown;
}
