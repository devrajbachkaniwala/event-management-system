'use client';

import { EventBookingCard } from '@/components/EventBookingCard';
import { Toast } from '@/components/Toast';
import { BookingDto } from '@/dto/booking.dto';
import { cancelBooking } from '@/utils/cancelBooking';
import { getProfile } from '@/utils/getProfile';
import { getUserBookings } from '@/utils/getUserBookings';
import { wait } from '@/utils/wait';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function MyBookings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEventLoading, setIsEventLoading] = useState(true);
  const [activeBookings, setActiveBookings] = useState<BookingDto[]>();
  const [cancelledBookings, setCancelledBookings] = useState<BookingDto[]>();

  const [toastData, setToastData] = useState<TToast>();

  const router = useRouter();

  useEffect(() => {
    getProfile().then((user) => {
      if (!user) {
        router.replace('/login');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    getUserBookings()
      .then((bookings) => {
        const active: BookingDto[] = [];
        const cancelled: BookingDto[] = [];

        bookings?.forEach((booking) => {
          if (booking.status === 'ACTIVE') {
            active.push(booking);
          } else if (booking.status === 'CANCEL') {
            cancelled.push(booking);
          }
        });

        setActiveBookings(active);
        setCancelledBookings(cancelled);
      })
      .finally(() => setIsEventLoading(false));
  }, [router]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await cancelBooking(bookingId);

      if (res) {
        setToastData({
          success: true,
          message: res?.message ?? 'Successfully cancelled the booking'
        });
      } else {
        setToastData({
          success: false,
          message: 'Failed to cancel the booking'
        });
      }

      const cancel = activeBookings?.find(
        (booking) => booking.id === bookingId
      );

      if (cancel) {
        cancel.status = 'CANCEL';

        setActiveBookings(
          (bookings) => bookings?.filter((b) => b.id !== bookingId)
        );

        setCancelledBookings((prev) => {
          if (prev) {
            return [...prev, cancel];
          }
          return [cancel];
        });
      }
    } catch (err: any) {
      console.log(err);
    }

    await wait(1.5);
    setToastData(undefined);
  };

  if (isLoading || isEventLoading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <div className='mx-6'>
      <h2 className='font-bold text-2xl text-center my-6'>My Event Bookings</h2>

      <div className='mx-auto max-w-2xl'>
        <div>
          <h3 className='font-semibold text-xl text-center'>Active Bookings</h3>
          <div className='my-8 gap-6 w-full'>
            {activeBookings && activeBookings.length ? (
              activeBookings.map(
                (booking) =>
                  booking.event &&
                  booking.price &&
                  booking.timing && (
                    <Link key={booking.id} href={`/events/${booking.event.id}`}>
                      <EventBookingCard
                        id={booking.id}
                        price={booking.price}
                        timing={booking.timing}
                        booking={booking}
                        event={booking.event}
                        className='card-side w-full mt-6'
                        handleCancel={() => handleCancelBooking(booking.id)}
                      />
                    </Link>
                  )
              )
            ) : (
              <div className='text-center'>No active bookings</div>
            )}
          </div>
        </div>

        <div>
          <h3 className='font-semibold text-xl text-center'>
            Cancelled Bookings
          </h3>
          <div className='my-8 gap-6 w-full'>
            {cancelledBookings && cancelledBookings.length ? (
              cancelledBookings.map(
                (booking) =>
                  booking.event &&
                  booking.price &&
                  booking.timing && (
                    <Link key={booking.id} href={`/events/${booking.event.id}`}>
                      <EventBookingCard
                        id={booking.id}
                        price={booking.price}
                        timing={booking.timing}
                        booking={booking}
                        event={booking.event}
                        className='card-side w-full mt-6'
                        handleCancel={() => handleCancelBooking(booking.id)}
                      />
                    </Link>
                  )
              )
            ) : (
              <div className='text-center'>No cancelled bookings</div>
            )}
          </div>
        </div>
      </div>

      <Toast toastData={toastData} />
    </div>
  );
}

export default MyBookings;
