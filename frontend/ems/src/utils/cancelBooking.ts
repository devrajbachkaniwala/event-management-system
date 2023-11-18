import { BookingsService } from '@/services/bookings-service';

export const cancelBooking = async (bookingId: string) => {
  try {
    const res = await BookingsService.cancelBooking(bookingId);

    return res;
  } catch (err: any) {
    console.log(err);
  }
};
