import { BookingError } from './booking.error';

export class BookingNotFound extends BookingError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'Booking not found', statusCode);
  }
}
