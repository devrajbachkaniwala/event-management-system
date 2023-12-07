import { BookingsService } from '@/services/bookings-service';

export const getUserBookings = async () => {
  try {
    const bookings = await BookingsService.getUserBookings();

    return bookings;
  } catch (err: any) {
    console.log(err);
  }
};
