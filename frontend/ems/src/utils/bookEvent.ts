import { CreateBookingDto } from '@/dto/create-booking.dto';
import { BookingsService } from '@/services/bookings-service';

export const bookEvent = async (createBooking: CreateBookingDto) => {
  try {
    const booking = await BookingsService.bookEvent(createBooking);
    return booking;
  } catch (err: any) {
    console.log(err);
  }
};
