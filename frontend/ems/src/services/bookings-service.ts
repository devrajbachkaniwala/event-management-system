import { BookingDto } from '@/dto/booking.dto';
import { EnvService } from './env-service';
import { FetchService } from './fetch-service';
import { retryFunction } from '@/utils/retryFunction';
import { CreateBookingDto } from '@/dto/create-booking.dto';

export class BookingsService {
  static async getUserBookings(): Promise<BookingDto[]> {
    const _url = `${EnvService.getServerUrl()}/v1/bookings`;
    const url = new URL(_url);
    url.searchParams.set('include', 'event,organization,price,timing');

    const res = await FetchService.getWithNoStore(url.toString(), {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new BookingsServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.getUserBookings();
      }
    }

    return resData.data as BookingDto[];
  }

  static async cancelBooking(bookingId: string): Promise<{ message: string }> {
    const url = `${EnvService.getServerUrl()}/v1/bookings/${bookingId}/cancel`;

    const res = await FetchService.patch(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new BookingsServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.cancelBooking(bookingId);
      }
    }

    return resData.data as { message: string };
  }

  static async bookEvent(createBooking: CreateBookingDto): Promise<BookingDto> {
    const url = `${EnvService.getServerUrl()}/v1/bookings`;

    const res = await FetchService.post(url, {
      authTokenType: 'accessToken',
      contentType: 'application/json',
      body: createBooking
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new BookingsServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.bookEvent(createBooking);
      }
    }

    return resData.data as BookingDto;
  }
}

export class BookingsServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
